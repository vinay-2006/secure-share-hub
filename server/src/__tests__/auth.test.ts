import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes';
import { errorHandler } from '../middleware/errorHandler';

// Create a test app instance
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use(errorHandler);
  return app;
};

describe('Authentication API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.data.user).toHaveProperty('name', 'Test User');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should reject registration with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'Test123!',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test123!',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '12345',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          name: 'Test User',
        });

      // Duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test456!',
          name: 'Another User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          name: 'Test User',
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/admin/login', () => {
    beforeEach(async () => {
      // Create an admin user directly
      const { User } = await import('../models/User');
      const bcrypt = await import('bcryptjs');
      
      await User.create({
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin123!', 10),
        name: 'Admin User',
        role: 'admin',
      });
    });

    it('should login admin with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({
          email: 'admin@example.com',
          password: 'Admin123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('role', 'admin');
    });

    it('should reject non-admin user from admin login', async () => {
      // Create a regular user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'User123!',
          name: 'Regular User',
        });

      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({
          email: 'user@example.com',
          password: 'User123!',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      // Register and get token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          name: 'Test User',
        });

      const token = registerResponse.body.data.accessToken;

      // Get current user
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('email', 'test@example.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      // Register and get refresh token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          name: 'Test User',
        });

      const refreshToken = registerResponse.body.data.refreshToken;

      // Refresh token
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
