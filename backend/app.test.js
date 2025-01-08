const request = require('supertest');
const app = require('./app');
const db = require('./db/connection');
const seed = require('./db/seeds/seed');
const data = require('./db/data/test-data');
const jestSorted = require('jest-sorted');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('GET /api/users', () => {
  test('200: return an array of users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    const { users } = response.body;
    expect(users.length).toBeGreaterThan(1);
    users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
        email: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });
  });
});

describe('GET /api/users/3', () => {
  test('200: return an array for a specific user', async () => {
    const response = await request(app).get('/api/users/3');
    expect(response.status).toBe(200);
    const { user } = response.body;
    expect(user).toEqual({
      user_id: 3,
      username: 'coolgamer',
      password: 'gamer$life2024',
      email: 'coolgamer@example.com',
      created_at: '2024-12-10T09:45:00.000Z',
      updated_at: '2024-12-15T11:00:00.000Z',
    });
  });
});
