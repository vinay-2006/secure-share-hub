import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:5000/api';

// Mock user data
const mockUsers = new Map([
  ['user@example.com', {
    userId: 'user-1',
    email: 'user@example.com',
    name: 'Alex Chen',
    role: 'user',
    password: 'user123',
  }],
  ['admin@example.com', {
    userId: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
  }],
]);

// Generate mock tokens
const generateToken = () => `mock-token-${Math.random().toString(36).substring(2, 11)}`;

export const handlers = [
  // Register
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string; name: string };
    
    if (mockUsers.has(body.email)) {
      return HttpResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    const user = {
      userId: `user-${mockUsers.size + 1}`,
      email: body.email,
      name: body.name,
      role: 'user',
    };

    mockUsers.set(body.email, { ...user, password: body.password });

    return HttpResponse.json({
      success: true,
      data: {
        user,
        accessToken: generateToken(),
        refreshToken: generateToken(),
      },
    }, { status: 201 });
  }),

  // User Login
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    const user = mockUsers.get(body.email);

    if (!user || user.password !== body.password || user.role !== 'user') {
      return HttpResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const { password, ...userWithoutPassword } = user;

    return HttpResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        accessToken: generateToken(),
        refreshToken: generateToken(),
      },
    });
  }),

  // Admin Login
  http.post(`${API_BASE_URL}/auth/admin/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    const user = mockUsers.get(body.email);

    if (!user || user.password !== body.password) {
      return HttpResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { password, ...userWithoutPassword } = user;

    return HttpResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        accessToken: generateToken(),
        refreshToken: generateToken(),
      },
    });
  }),

  // Get current user
  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    // For testing purposes, return the first user
    const firstUser = Array.from(mockUsers.values())[0];
    const { password, ...userWithoutPassword } = firstUser;

    return HttpResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  }),

  // Logout
  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  }),

  // Refresh token
  http.post(`${API_BASE_URL}/auth/refresh`, async ({ request }) => {
    const body = await request.json() as { refreshToken: string };
    
    if (!body.refreshToken) {
      return HttpResponse.json(
        { success: false, message: 'No refresh token provided' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        accessToken: generateToken(),
      },
    });
  }),
];
