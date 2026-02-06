import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as crypto from 'crypto';
import { User } from '../models/User';
import { AuthRequest, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
      });
      return;
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: {
          message: 'User with this email already exists',
          code: 'USER_EXISTS',
        },
      });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role: 'user',
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        user: {
          userId: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to register user',
        code: 'REGISTER_ERROR',
      },
    });
  }
};

/**
 * User login
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
      });
      return;
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        },
      });
      return;
    }

    // Check if account is locked
    if (user.isLocked()) {
      res.status(423).json({
        success: false,
        error: {
          message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.',
          code: 'ACCOUNT_LOCKED',
          lockUntil: user.lockUntil,
        },
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementFailedAttempts();
      
      // Refetch user to get updated attempt count
      const updatedUser = await User.findById(user._id);
      
      const remainingAttempts = 5 - (updatedUser?.failedLoginAttempts || 0);
      if (remainingAttempts > 0 && remainingAttempts <= 5) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Invalid email or password',
            code: 'INVALID_CREDENTIALS',
            remainingAttempts,
          },
        });
      } else {
        res.status(423).json({
          success: false,
          error: {
            message: 'Account locked due to too many failed login attempts. Please try again in 15 minutes.',
            code: 'ACCOUNT_LOCKED',
            lockUntil: updatedUser?.lockUntil,
          },
        });
      }
      return;
    }

    // Reset failed attempts on successful login
    await user.resetFailedAttempts();

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.json({
      success: true,
      data: {
        user: {
          userId: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to login',
        code: 'LOGIN_ERROR',
      },
    });
  }
};

/**
 * Admin login
 * POST /api/auth/admin/login
 */
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
      });
      return;
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid admin credentials',
          code: 'INVALID_ADMIN_CREDENTIALS',
        },
      });
      return;
    }

    // Check if account is locked
    if (user.isLocked()) {
      res.status(423).json({
        success: false,
        error: {
          message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.',
          code: 'ACCOUNT_LOCKED',
          lockUntil: user.lockUntil,
        },
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementFailedAttempts();
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid admin credentials',
          code: 'INVALID_ADMIN_CREDENTIALS',
        },
      });
      return;
    }

    // Reset failed attempts on successful login
    await user.resetFailedAttempts();

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.json({
      success: true,
      data: {
        user: {
          userId: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to login',
        code: 'LOGIN_ERROR',
      },
    });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Refresh token is required',
          code: 'NO_REFRESH_TOKEN',
        },
      });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid or expired refresh token',
          code: 'INVALID_REFRESH_TOKEN',
        },
      });
      return;
    }

    // Generate new access token
    const accessToken = generateAccessToken(decoded.userId);

    res.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to refresh token',
        code: 'REFRESH_ERROR',
      },
    });
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Not authenticated',
          code: 'NOT_AUTHENTICATED',
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          userId: req.user._id,
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
        },
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get user',
        code: 'GET_USER_ERROR',
      },
    });
  }
};

/**
 * Logout (optional - client-side token removal)
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  // In a stateless JWT system, logout is primarily handled client-side
  // by removing the tokens. This endpoint can be used for logging purposes
  // or if implementing a token blacklist.
  res.json({
    success: true,
    data: {
      message: 'Logged out successfully',
    },
  });
};

/**
 * Request password reset
 * POST /api/auth/password/reset-request
 */
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
      });
      return;
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    
    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      res.json({
        success: true,
        data: {
          message: 'If an account with that email exists, a password reset link has been sent.',
        },
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiry (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // In a real application, you would send an email with the reset token
    // For now, we'll return the token in the response (for testing purposes only)
    res.json({
      success: true,
      data: {
        message: 'If an account with that email exists, a password reset link has been sent.',
        // NOTE: In production, remove this token from response and send via email
        resetToken: resetToken,
      },
    });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process password reset request',
        code: 'PASSWORD_RESET_REQUEST_ERROR',
      },
    });
  }
};

/**
 * Reset password with token
 * POST /api/auth/password/reset
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
      });
      return;
    }

    const { token, newPassword } = req.body;

    // Hash the provided token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid or expired reset token',
          code: 'INVALID_RESET_TOKEN',
        },
      });
      return;
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    
    // Also reset failed login attempts when password is reset
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    
    await user.save();

    res.json({
      success: true,
      data: {
        message: 'Password has been reset successfully',
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to reset password',
        code: 'PASSWORD_RESET_ERROR',
      },
    });
  }
};
