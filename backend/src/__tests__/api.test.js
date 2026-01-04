import { jest } from '@jest/globals';
import request from 'supertest';

const PRISMA_PATH = '../prisma/client.ts';
jest.unstable_mockModule(PRISMA_PATH, () => ({
  default: {
    user: { create: jest.fn(), findUnique: jest.fn() },
    task: { create: jest.fn(), findMany: jest.fn() }, // Mocks for tasks
  },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn(() => ({ userId: 1, email: 'john@example.com' }))
  }
}));

const { default: prisma } = await import(PRISMA_PATH);
const { default: jwt } = await import('jsonwebtoken');
const { default: app } = await import('../app.ts');

describe('API Integration Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  // --- Auth Tests ---
  describe('Auth API', () => {
    it('should register a new user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 1, email: 'john@example.com' });

      const res = await request(app)
        .post('/auth/register')
        .send({ name: 'John', email: 'john@example.com', password: '123' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('successfully');
    });
  });

  // --- Task Tests ---
  describe('Task API (Protected)', () => {
    beforeEach(() => jest.clearAllMocks());
    const validHeader = { 'Authorization': 'Bearer real-looking-token' };

    it("should fail when token is missing", async () => {
      const mockTask = { id: 101, title: 'Secure Task', description: "Test", userId: 1 };
      prisma.task.create.mockResolvedValue(mockTask);
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Secure Task', description: "Test", userId: 1 });

      expect(res.statusCode).toBe(401);
    })
    it('should create a new task when authorized', async () => {
      const mockTask = { id: 101, title: 'Secure Task', description: "Test", userId: 1 };
      prisma.task.create.mockResolvedValue(mockTask);

      const res = await request(app)
        .post('/tasks')
        .set(validHeader)
        .send({ title: 'Secure Task', description: "Test", userId: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body.task.title).toBe('Secure Task');
      expect(res.body.message).toBe("Task created successfully");
    });

    it('should list tasks for the authorized user', async () => {
      prisma.task.findMany.mockResolvedValue([{ id: 1, title: 'My Task' }]);

      const res = await request(app)
        .get('/tasks')
        .set(validHeader);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.tasks)).toBe(true);
      expect(res.body.tasks[0].title).toBe('My Task');
    });
  });
})