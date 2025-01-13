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

// TESTING API/USERS---------------------------------------------------

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

//TESTING API/USERS/:USER_ID---------------------------------------------------

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

  test("404, error when user_id does not exist but is valid", async () => {
    const response = await request(app).get("/api/users/9999")
    expect(response.status).toBe(404)
    expect(response.body.msg).toBe("User not found for user_id: 9999")
  })

  test("404, error when user_id is invalid", async () => {
    const response = await request(app).get("/api/users/cheesecake")
    expect(response.status).toBe(404)
    expect(response.body.msg).toBe("Bad Request")
  })
});

// TESTING API/USER_PREFERENCES ---------------------------------------------------

describe('GET /api/user_preferences', () => {
  test('200: return an array for all user preferences', async () => {
    const response = await request(app).get('/api/user_preferences')
    expect(response.status).toBe(200)
    const { user_preferences } = response.body
    expect(user_preferences.length).toBeGreaterThan(1)
    user_preferences.forEach((preference) => {
      expect(preference).toMatchObject({
        preference_id: expect.any(Number),
        user_id: expect.any(Number),
        preference_type: expect.any(String),
      })
    })
  }) 

  test('200: return a specific user preference based on type query parameter', async () => {
    const response = await request(app).get('/api/user_preferences?type=food')
    expect(response.status).toBe(200)
    const { user_preferences } = response.body
    expect(user_preferences).toEqual([
      {
        preference_id: 2,
        user_id: 1,
        preference_type: 'comedy',
      },
      {
        preference_id: 10,
        user_id: 3,
        preference_type: 'comedy',
      },
      {
        preference_id: 20,
        user_id: 5,
        preference_type: 'comedy',
      }
  ])
  })

  test('200: return a specific user preference based on id query parameter', async () => {
    const response = await request(app).get('/api/user_preferences?id=3')
    expect(response.status).toBe(200)
    const { user_preferences } = response.body
    expect(user_preferences).toEqual([
      {
        preference_id: 9,
        user_id: 3,
        preference_type: 'animals',
      },
      {
        preference_id: 10,
        user_id: 3,
        preference_type: 'comedy',
      },
      {
        preference_id: 11,
        user_id: 3,
        preference_type: 'games',
      },
      {
        preference_id: 12,
        user_id: 3,
        preference_type: 'sport',
      }
  ])
  })

  test('200: returns preferences filtered by user_id and type', async () => {
    const response = await request(app).get('/api/user_preferences?id=4&type=food')
    expect(response.status).toBe(200)
    const { user_preferences } = response.body
    expect(user_preferences).toEqual([
      {
        preference_id: 13,
        user_id: 4,
        preference_type: 'food',
      }
  ])
  })

  test('200: returns an empty array if valid id and type with no matching preferences', async () => {
    const response = await request(app).get('/api/user_preferences?id=14&type=cheese')
    expect(response.status).toBe(200)
    const { user_preferences } = response.body
    expect(user_preferences).not.toContain(expect.anything())
  })

  test('200: should return all user preferences within 5 seconds', async () => {
    const response = await request(app)
      .get('/api/user_preferences')
      .timeout(5000); 
    expect(response.status).toBe(200);
  });
  

  test("404: returns an error when user_id is valid but does not exist", async () => {
    const response = await request(app).get("/api/user_preferences?id=9999")
    expect(response.status).toBe(404)
    expect(response.body.msg).toBe("User not found for user_id: 9999")
  })

  test("400, error when type does not exist but user_id does", async () => {
    const response = await request(app).get("/api/user_preferences?type=language&id=2")
    expect(response.status).toBe(400)
    expect(response.body.msg).toBe("Bad Request")
  })

  test("400, returns an error when testing for invalid query parameters", async () => {
    const response = await request(app).get("/api/user_preferences?type=abc&id=123")
    expect(response.status).toBe(400)
    expect(response.body.msg).toBe("Bad Request")
  })

})



