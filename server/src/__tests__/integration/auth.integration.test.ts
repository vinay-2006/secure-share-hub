import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express, { Express } from 'express';
import authRoutes from '../../routes/auth.routes';
import { User } from '../../models/User';
import crypto from 'crypto';

let mongoServer: MongoMemoryServer;
let app: Express;

describe('Auth Controller Integration Tests', () => {
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Setup express app
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('POST /api/auth/register - Password Strength', () => {
    it('should reject registration with weak password (no uppercase)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'weakpass123!',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject registration with weak password (no special char)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'WeakPass123',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration with weak password (too short)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Wp1!',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should accept registration with strong password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'StrongPass123!',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.accessToken).toBeDefined();
    });
  });

  describe('POST /api/auth/login - Account Lockout', () => {
    beforeEach(async () => {
      // Create a test user
      const user = new User({
        email: 'locktest@example.com',
        password: 'TestPass123!',
        name: 'Lock Test User',
      });
      await user.save();
    });

    it('should successfully login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'locktest@example.com',
          password: 'TestPass123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should increment failed attempts on wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'locktest@example.com',
          password: 'WrongPass123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
      expect(response.body.error.remainingAttempts).toBe(4);

      const user = await User.findOne({ email: 'locktest@example.com' });
      expect(user?.failedLoginAttempts).toBe(1);
    });

    it('should lock account after 5 failed attempts', async () => {
      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'locktest@example.com',
            password: 'WrongPass123!',
          });
      }

      const user = await User.findOne({ email: 'locktest@example.com' });
      expect(user?.failedLoginAttempts).toBe(5);
      expect(user?.isLocked()).toBe(true);
    });

    it('should return locked status on 5th failed attempt', async () => {
      // Make 4 failed attempts
      for (let i = 0; i < 4; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'locktest@example.com',
            password: 'WrongPass123!',
          });
      }

      // 5th attempt should lock the account
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'locktest@example.com',
          password: 'WrongPass123!',
        });

      expect(response.status).toBe(423);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ACCOUNT_LOCKED');
      expect(response.body.error.lockUntil).toBeDefined();
    });

    it('should prevent login when account is locked', async () => {
      // Lock the account
      const user = await User.findOne({ email: 'locktest@example.com' });
      user!.failedLoginAttempts = 5;
      user!.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      await user!.save();

      // Try to login with correct password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'locktest@example.com',
          password: 'TestPass123!',
        });

      expect(response.status).toBe(423);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ACCOUNT_LOCKED');
    });

    it('should reset failed attempts on successful login', async () => {
      // Add some failed attempts
      const user = await User.findOne({ email: 'locktest@example.com' });
      user!.failedLoginAttempts = 3;
      await user!.save();

      // Successful login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'locktest@example.com',
          password: 'TestPass123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const updatedUser = await User.findOne({ email: 'locktest@example.com' });
      expect(updatedUser?.failedLoginAttempts).toBe(0);
    });

    it('should show remaining attempts in error response', async () => {
      // Make 2 failed attempts
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'locktest@example.com',
          password: 'WrongPass123!',
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'locktest@example.com',
          password: 'WrongPass123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.error.remainingAttempts).toBe(3);
    });
  });

  describe('POST /api/auth/admin/login - Account Lockout', () => {
    beforeEach(async () => {
      // Create a test admin user
      const admin = new User({
        email: 'admin@example.com',
        password: 'AdminPass123!',
        name: 'Admin User',
        role: 'admin',
      });
      await admin.save();
    });

    it('should lock admin account after failed attempts', async () => {
      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/admin/login')
          .send({
            email: 'admin@example.com',
            password: 'WrongPass123!',
          });
      }

      const user = await User.findOne({ email: 'admin@example.com' });
      expect(user?.isLocked()).toBe(true);
    });

    it('should prevent admin login when locked', async () => {
      const user = await User.findOne({ email: 'admin@example.com' });
      user!.failedLoginAttempts = 5;
      user!.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      await user!.save();

      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPass123!',
        });

      expect(response.status).toBe(423);
      expect(response.body.error.code).toBe('ACCOUNT_LOCKED');
    });
  });

  describe('POST /api/auth/password/reset-request', () => {
    beforeEach(async () => {
      const user = new User({
        email: 'reset@example.com',
        password: 'OldPass123!',
        name: 'Reset Test User',
      });
      await user.save();
    });

    it('should generate password reset token', async () => {
      const response = await request(app)
        .post('/api/auth/password/reset-request')
        .send({
          email: 'reset@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('password reset');
      expect(response.body.data.resetToken).toBeDefined();

      const user = await User.findOne({ email: 'reset@example.com' });
      expect(user?.resetPasswordToken).toBeDefined();
      expect(user?.resetPasswordExpiry).toBeDefined();
    });

    it('should return success even for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/password/reset-request')
        .send({
          email: 'nonexistent@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('password reset');
    });

    it('should set token expiry to 1 hour', async () => {
      const response = await request(app)
        .post('/api/auth/password/reset-request')
        .send({
          email: 'reset@example.com',
        });

      expect(response.status).toBe(200);

      const user = await User.findOne({ email: 'reset@example.com' });
      const expiryTime = user!.resetPasswordExpiry!.getTime() - Date.now();
      const oneHour = 60 * 60 * 1000;

      expect(expiryTime).toBeGreaterThan(oneHour - 5000);
      expect(expiryTime).toBeLessThanOrEqual(oneHour);
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/password/reset-request')
        .send({
          email: 'invalidemail',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should overwrite previous reset token', async () => {
      // First request
      const firstResponse = await request(app)
        .post('/api/auth/password/reset-request')
        .send({
          email: 'reset@example.com',
        });

      const firstToken = firstResponse.body.data.resetToken;

      // Second request
      const secondResponse = await request(app)
        .post('/api/auth/password/reset-request')
        .send({
          email: 'reset@example.com',
        });

      const secondToken = secondResponse.body.data.resetToken;

      expect(firstToken).not.toBe(secondToken);

      const user = await User.findOne({ email: 'reset@example.com' });
      const secondHashedToken = crypto.createHash('sha256').update(secondToken).digest('hex');
      expect(user?.resetPasswordToken).toBe(secondHashedToken);
    });
  });

  describe('POST /api/auth/password/reset', () => {
    let resetToken: string;

    beforeEach(async () => {
      const user = new User({
        email: 'reset@example.com',
        password: 'OldPass123!',
        name: 'Reset Test User',
      });
      await user.save();

      // Generate reset token
      const response = await request(app)
        .post('/api/auth/password/reset-request')
        .send({
          email: 'reset@example.com',
        });

      resetToken = response.body.data.resetToken;
    });

    it('should reset password with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/password/reset')
        .send({
          token: resetToken,
          newPassword: 'NewPass123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('reset successfully');

      // Verify new password works
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'reset@example.com',
          password: 'NewPass123!',
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
    });

    it('should clear reset token after successful reset', async () => {
      await request(app)
        .post('/api/auth/password/reset')
        .send({
          token: resetToken,
          newPassword: 'NewPass123!',
        });

      const user = await User.findOne({ email: 'reset@example.com' });
      expect(user?.resetPasswordToken).toBeUndefined();
      expect(user?.resetPasswordExpiry).toBeUndefined();
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/password/reset')
        .send({
          token: 'invalid-token-123',
          newPassword: 'NewPass123!',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_RESET_TOKEN');
    });

    it('should reject expired token', async () => {
      // Manually expire the token
      const user = await User.findOne({ email: 'reset@example.com' });
      user!.resetPasswordExpiry = new Date(Date.now() - 1000);
      await user!.save();

      const response = await request(app)
        .post('/api/auth/password/reset')
        .send({
          token: resetToken,
          newPassword: 'NewPass123!',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_RESET_TOKEN');
    });

    it('should reject weak new password', async () => {
      const response = await request(app)
        .post('/api/auth/password/reset')
        .send({
          token: resetToken,
          newPassword: 'weak',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reset failed login attempts on password reset', async () => {
      // Add failed attempts and lock
      const user = await User.findOne({ email: 'reset@example.com' });
      user!.failedLoginAttempts = 5;
      user!.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      await user!.save();

      // Reset password
      await request(app)
        .post('/api/auth/password/reset')
        .send({
          token: resetToken,
          newPassword: 'NewPass123!',
        });

      const updatedUser = await User.findOne({ email: 'reset@example.com' });
      expect(updatedUser?.failedLoginAttempts).toBe(0);
      expect(updatedUser?.lockUntil).toBeUndefined();
      expect(updatedUser?.isLocked()).toBe(false);
    });

    it('should not allow reusing same token twice', async () => {
      // First reset
      const firstResponse = await request(app)
        .post('/api/auth/password/reset')
        .send({
          token: resetToken,
          newPassword: 'NewPass123!',
        });

      expect(firstResponse.status).toBe(200);

      // Try to use same token again
      const secondResponse = await request(app)
        .post('/api/auth/password/reset')
        .send({
          token: resetToken,
          newPassword: 'AnotherPass123!',
        });

      expect(secondResponse.status).toBe(400);
      expect(secondResponse.body.error.code).toBe('INVALID_RESET_TOKEN');
    });
  });
});
