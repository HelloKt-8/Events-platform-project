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
  test.only('200: return an array of users', async () => {
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
  test.only('200: return an array for a specific user', async () => {
    const response = await request(app).get('/api/users/3');
    expect(response.status).toBe(200);
    const { user } = response.body;
    expect(user).toEqual({
      user_id: 3,
      username: 'bob_smith',
      password: 'password789!',
      email: 'bob.smith@example.com',
      user_type: 'admin',
      created_at: '2024-12-03T12:00:00.000Z',
      updated_at: '2024-12-03T12:00:00.000Z',
    });
  });

  test.only('404, error when user_id does not exist but is valid', async () => {
    const response = await request(app).get('/api/users/9999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 9999');
  });

  test.only('404, error when user_id is invalid', async () => {
    const response = await request(app).get('/api/users/cheesecake');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

// TESTING API/USER_PREFERENCES ---------------------------------------------------

describe('GET /api/user_preferences', () => {
  test.only('200: return an array for all user preferences', async () => {
    const response = await request(app).get('/api/user_preferences');
    expect(response.status).toBe(200);
    const { userPreferences } = response.body;
    expect(userPreferences.length).toBeGreaterThan(1);
    userPreferences.forEach((preference) => {
      expect(preference).toMatchObject({
        preference_id: expect.any(Number),
        user_id: expect.any(Number),
        preference_type: expect.any(String),
      });
    });
  });

  test.only('200: return a specific user preference based on type query parameter', async () => {
    const response = await request(app).get(
      '/api/user_preferences?preference_type=comedy'
    );
    expect(response.status).toBe(200);
    const { userPreferences } = response.body;
    expect(userPreferences).toEqual([
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
      },
    ]);
  });

  test.only('200: return a specific user preference based on id query parameter', async () => {
    const response = await request(app).get('/api/user_preferences?user_id=3');
    expect(response.status).toBe(200);
    const { userPreferences } = response.body;
    expect(userPreferences).toEqual([
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
      },
    ]);
  });

  test.only('200: returns preferences filtered by user_id and type', async () => {
    const response = await request(app).get(
      '/api/user_preferences?user_id=4&preference_type=food'
    );
    expect(response.status).toBe(200);
    const { userPreferences } = response.body;
    expect(userPreferences).toEqual([
      {
        preference_id: 13,
        user_id: 4,
        preference_type: 'food',
      },
    ]);
  });

  test.only('200: returns an empty array if valid id and type with no matching preferences', async () => {
    const response = await request(app).get(
      '/api/user_preferences?id=14&type=cheese'
    );
    expect(response.status).toBe(200);
    const { userPreferences } = response.body;
    expect(userPreferences).not.toContain(expect.anything());
  });

  test.only('200: should return all user preferences within 5 seconds', async () => {
    const response = await request(app)
      .get('/api/user_preferences')
      .timeout(5000);
    expect(response.status).toBe(200);
  });

  test.only('404: returns an error when user_id is valid but does not exist', async () => {
    const response = await request(app).get(
      '/api/user_preferences?user_id=9999'
    );
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      'User not found for user_id or preference_type'
    );
  });

  test.only('400, error when type does not exist but user_id does', async () => {
    const response = await request(app).get(
      '/api/user_preferences?preference_type=language&user_id=2'
    );
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      'User not found for user_id or preference_type'
    );
  });

  test.only('400, returns an error when testing for invalid query parameters', async () => {
    const response = await request(app).get(
      '/api/user_preferences?preference_type=123&user_id=abc'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

// TESTING API/USER_ACTIVITY ---------------------------------------------------

describe('GET /api/user_activity', () => {
  test.only('200: returns array of user_acitivty filtered by user_id', async () => {
    const response = await request(app).get('/api/user_activity?user_id=3');
    expect(response.status).toBe(200);
    const { userActivity } = response.body;
    expect(userActivity).toEqual([
      {
        activity_id: 9,
        user_id: 3,
        activity_type: 'login',
        activity_timestamp: '2024-12-18T10:00:00.000Z'
      },
      {
        activity_id: 10,
        user_id: 3,
        activity_type: 'event add',
        activity_timestamp: '2024-12-18T10:10:00.000Z'
      },
      {
        activity_id: 11,
        user_id: 3,
        activity_type: 'preference delete',
        activity_timestamp: '2024-12-18T10:30:00.000Z'
      },
      {
        activity_id: 12,
        user_id: 3,
        activity_type: 'logout',
        activity_timestamp: '2024-12-18T11:00:00.000Z'
      }
    ]);
  });

  test.only('200: should return all user preferences within 5 seconds', async () => {
    const response = await request(app)
      .get('/api/user_activity?user_id=1')
      .timeout(5000);
    expect(response.status).toBe(200);
  });

  test.only('404: returns an error when user_id is valid but does not exist', async () => {
    const response = await request(app).get('/api/user_activity?user_id=9999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User_id or User_Activity not found');
  });

  test.only('400, returns an error when no user_id is given', async () => {
    const response = await request(app).get('/api/user_activity');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User_id or User_Activity not found');
  });
});

// TESTING API/EVENTS ---------------------------------------------------

describe('GET /api/events', () => {
  test('200: return an array for all events', async () => {
    const response = await request(app).get('/api/events').timeout(5000);
    expect(response.status).toBe(200);
    const { events } = response.body;
    expect(events.length).toBeGreaterThan(1);
    events.forEach((event) => {
      expect(event).toMatchObject({
        event_id: expect.any(Number),
        user_id: expect.any(Number),
        event_name: expect.any(String),
        event_date: expect.any(String),
        event_type: expect.any(String),
        payment_status: expect.any(String),
      });
    });
  });

  test('200: return all events filtered by user_id', async () => {
    const response = await request(app).get('/api/events?user_id=5');
    expect(response.status).toBe(200);
    const { events } = response.body;
    expect(events).toEqual([
      {
        event_id: 9,
        user_id: 5,
        event_name: 'Book Club Meeting',
        event_date: '2024-12-29',
        event_type: 'books',
        payment_status: 'free',
      },
      {
        event_id: 10,
        user_id: 5,
        event_name: 'Political Debate',
        event_date: '2024-12-30',
        event_type: 'politics',
        payment_status: 'paid',
      },
      {
        event_id: 15,
        user_id: 5,
        event_name: 'Reading Marathon',
        event_date: '2025-01-10',
        event_type: 'books',
        payment_status: 'paid',
      },
      {
        event_id: 20,
        user_id: 5,
        event_name: 'Romantic Getaway',
        event_date: '2025-01-22',
        event_type: 'romance',
        payment_status: 'paid',
      },
    ]);
  });

  test('200: return events filted by user_id and event_type', async () => {
    const response = await request(app).get(
      '/api/events?user_id=3&event_type=sport'
    );
    expect(response.status).toBe(200);
    const { events } = response.body;
    expect(events).toEqual([
      {
        event_id: 18,
        user_id: 3,
        event_name: 'Football Game',
        event_date: '2025-01-18',
        event_type: 'sport',
        payment_status: 'pending',
      },
    ]);
  });

  test('200: return an array filtered by event_id', async () => {
    const response = await request(app).get('/api/events?event_id=4');
    expect(response.status).toBe(200);
    const { events } = response.body;
    expect(events).toEqual([
      {
        event_id: 4,
        user_id: 2,
        event_name: 'Music Concert',
        event_date: '2024-12-24',
        event_type: 'party',
        payment_status: 'pending',
      },
    ]);
  });

  test('200: returns an empty array if valid id but no events', async () => {
    const response = await request(app).get('/api/events?user_id=10');
    expect(response.status).toBe(200);
    const { events } = response.body;
    expect(events).toEqual([]);
    expect(Array.isArray(events).toBe(true));
    expect(events.length).toBe(0);
  });

  test('404: returns an error when user_id is valid but does not exist', async () => {
    const response = await request(app).get('/api/events?user_id=9999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 9999');
  });

  test('400, error when event does not exist but user_id does', async () => {
    const response = await request(app).get(
      '/api/user_preferences?event_id=999&user_id=2'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });

  test('400, returns an error when testing for invalid query parameters', async () => {
    const response = await request(app).get(
      '/api/events?event_id=123&user_id=123'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });

  test('400: reutrns an error for invalid query values', async () => {
    const response = await request(app).get('/api/events?user_id=abc');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid user_id');
  });
});

// TESTING API/EVENT_ATTENDEES/:event_id ---------------------------------------------------

describe('GET /event_attendees/:event_id', () => {
  // Test for valid event_id with attendees
  test('200: returns list of attendees for a valid event_id', async () => {
    const response = await request(app).get('/event_attendees/1');
    expect(response.status).toBe(200);
    const { attendees } = response.body;
    expect(Array.isArray(attendees)).toBe(true);
    expect(attendees.length).toBeGreaterThan(0); // Assuming the event has attendees
    attendees.forEach((attendee) => {
      expect(attendee).toMatchObject({
        attendee_id: expect.any(Number),
        event_id: 1,
        user_id: expect.any(Number),
        user_name: expect.any(String),
      });
    });
  });

  // Test for invalid event_id
  test('400: returns an error when event_id is not a number', async () => {
    const response = await request(app).get('/event_attendees/invalid_id');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid event_id');
  });

  // Test for non-existent event_id
  test('404: returns an error when event_id does not exist', async () => {
    const response = await request(app).get('/event_attendees/9999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('No attendees found for event_id: 9999');
  });

  // Test for valid event_id but with no attendees
  test('404: returns an error when there are no attendees for the event_id', async () => {
    const response = await request(app).get('/event_attendees/2'); // Assuming event 2 has no attendees
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('No attendees found for event_id: 2');
  });

  // Test for server error (e.g., database failure)
  test('500: returns a server error on failure', async () => {
    // Mocking an error in DB query
    jest.spyOn(global, 'getAttendeesByEventId').mockImplementation(() => {
      throw new Error('Database failure');
    });

    const response = await request(app).get('/event_attendees/1');
    expect(response.status).toBe(500);
    expect(response.body.msg).toBe('Server error');
  });
});

// TESTING PATCH API/USERS/:USER_ID ---------------------------------------------------
describe('PATCH/api/users/user_id', () => {
  test('200: successfully updates one single changeable item of user information', async () => {
    const response = await request(app).patch('/api/users/1').send({
      username: 'johndoe777',
    });
    expect(response.status).toBe(200);
    expect(reponse.body.updated_at).not.toBe(response.body.created_at);
    expect(response.body).toEqual({
      user_id: 1,
      username: 'johndoe777',
      password: 'password123!',
      email: 'johndoe@example.com',
      created_at: '2024-12-01T10:00:00.000Z',
      updated_at: '2024-12-15T14:30:00.000Z',
    });
  });

  test('200: successfully updates multiple items of changeable user information', async () => {
    const response = await request(app).patch('/api/users/3').send({
      username: 'coolgamer500',
      password: 'cheesecake2024',
      email: 'coolgamer@gmail.com',
    });
    expect(response.status).toBe(200);
    expect(reponse.body.updated_at).not.toBe(response.body.created_at);
    expect(response.body).toEqual({
      user_id: 3,
      username: 'coolgamer500',
      password: 'cheesecake2024',
      email: 'coolgamer@gmail.com',
      created_at: '2024-12-10T09:45:00.000Z',
      updated_at: '2024-12-15T11:00:00.000Z',
    });
  });

  test('400: responds with an appropriate error message when not changing anything', async () => {
    const response = await request(app).patch('/api/users/1').send({});
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });

  test('404: responds with an appropriate error message when user_id is valid but does not exist', async () => {
    const updatedUser = {
      username: 'coolgamer500',
      password: 'cheesecake2024',
      email: 'coolgamer@gmail.com',
    };
    const response = await request(app)
      .patch('/api/users/9999')
      .send(updatedUser);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('user_id does not exist: 9999');
  });

  test('404: responds with an appropriate error message when user_id is not valid', async () => {
    const updatedUser = {
      username: 'coolgamer500',
      password: 'cheesecake2024',
      email: 'coolgamer@gmail.com',
    };
    const response = await request(app)
      .patch('/api/users/abc')
      .send(updatedUser);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });

  test('400: responds with an appropriate error message when passed an invalid type in the body', async () => {
    const response = await request(app)
      .patch('/api/users/5')
      .send({ username: 1234 });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });
});

// TESTING PATCH API/EVENTS/:event_id ---------------------------------------------------
describe('PATCH/api/events/:event_id', () => {
  test('200: successfully updates one single changeable item of event information', async () => {
    const response = await request(app).patch('/api/events/4').send({
      event_name: 'Political Debate',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      event_id: 17,
      user_id: 4,
      event_name: 'Political Debate',
      event_date: '2025-01-15',
      event_type: 'politics',
      payment_status: 'paid',
    });
  });

  test('200: successfully updates multiple items of changeable event information', async () => {
    const response = await request(app).patch('/api/events/18').send({
      event_name: 'Basketball Game',
      event_date: '2025-04-19',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      event_id: 18,
      user_id: 5,
      event_name: 'Basketball Game',
      event_date: '2025-04-19',
      event_type: 'sport',
      payment_status: 'pending',
    });
  });

  test('404: returns error when event ID is not found', async () => {
    const response = await request(app).patch('/api/events/999').send({
      event_name: 'Non-existent Event',
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Event not found',
    });
  });

  test('400: returns error when required fields are missing', async () => {
    const response = await request(app).patch('/api/events/4').send({
      // Missing event_name
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing required fields: event_name',
    });
  });

  test('400: returns error when data type is invalid', async () => {
    const response = await request(app).patch('/api/events/4').send({
      event_date: 'not-a-date', // Invalid date format
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid date format',
    });
  });

  test('400: returns error when event ID is invalid format', async () => {
    const response = await request(app).patch('/api/events/abc').send({
      event_name: 'Invalid ID Format',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid event ID format',
    });
  });

  test('400: returns error when payment status is invalid', async () => {
    const response = await request(app).patch('/api/events/4').send({
      payment_status: 'invalid_status', // Invalid payment status
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid payment status',
    });
  });
});

// TESTING PATCH API/user_preferences/:user_id ---------------------------------------------------
describe('PATCH/api/user_preferences/:user_id', () => {
  test('200: successfully updates one single changeable item of preference information', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/1?preference_id=3')
      .send({
        preference_type: 'cheeseboards',
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      preference_id: 3,
      user_id: 1,
      preference_type: 'cheeseboards',
    });
  });

  test('400: returns error when required fields are missing', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/4?preference_id=13')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing required fields: preference_type',
    });
  });

  test('400: returns error when data type is invalid', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/4?preference_id=14')
      .send({
        preference_type: 324234, // Invalid date format
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid preference type',
    });
  });

  test('400: returns error when user ID is invalid format', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/abc')
      .send({
        event_name: 'Invalid ID Format',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid user ID format',
    });
  });

  test('404: returns error when user does not exist', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/9999?preference_id=1')
      .send({
        preference_type: 'cheeseboards',
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'User not found',
    });
  });

  test('404: returns error when preference does not exist', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/1?preference_id=9999')
      .send({
        preference_type: 'cheeseboards',
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Preference not found',
    });
  });
});

// TESTING DELETE API/users/:user_id ---------------------------------------------------

describe('DELETE /api/users/:user_id', () => {
  test('204: delete a user', async () => {
    const response = await request(app).delete('/api/users/1');
    expect(response.status).toBe(204);
  });

  test('204: delete a user and verify removal', async () => {
    await request(app).delete('/api/users/1');
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 1');
  });

  test('404: when user_id does not exist', async () => {
    const response = await request(app).delete('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 999');
  });

  test('400: for invalid user_id data format', async () => {
    const response = await request(app).delete('/api/users/notvalidid');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('invalid user_id format');
  });
});

// TESTING DELETE API/users/:user_id ---------------------------------------------------

describe('DELETE /api/users/:user_id', () => {
  test('204: delete a user', async () => {
    const response = await request(app).delete('/api/users/1');
    expect(response.status).toBe(204);
  });

  test('204: delete a user and verify removal', async () => {
    await request(app).delete('/api/users/1');
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 1');
  });

  test('404: when user_id does not exist', async () => {
    const response = await request(app).delete('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 999');
  });

  test('400: for invalid user_id data format', async () => {
    const response = await request(app).delete('/api/users/notvalidid');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('invalid user_id format');
  });
});

// TESTING DELETE API/user_preference/:user_id/:preference_id ---------------------------------------------------

describe('DELETE /api/user_preference/:user_id/:preference_id', () => {
  test('204: delete a users preference', async () => {
    const response = await request(app).delete('/api/user_preferences/1/3');
    expect(response.status).toBe(204);
  });

  test('204: delete a users preference and verify removal', async () => {
    await request(app).delete('/api/user_preferences/1/3');
    const response = await request(app).get('/api/user_preferences/1/3');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User preference not found');
  });

  test('404: when user_id does not exist', async () => {
    const response = await request(app).delete('/api/user_preference/999/5');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 999');
  });

  test('400: for invalid user_id data format', async () => {
    const response = await request(app).delete(
      '/api/user_preferences/notvalidid/5'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('invalid user_id format');
  });

  test('400: for invalid preference_id data format', async () => {
    const response = await request(app).delete(
      '/api/user_preferences/2/invalidid'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('invalid preference_id format');
  });

  test('404: when preference_id does not exist for a valid user_id', async () => {
    const response = await request(app).delete('/api/user_preferences/1/999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      'Preference not found for preference_id: 999'
    );
  });

  test('400: when preference_id is missing from URL', async () => {
    const response = await request(app).delete('/api/user_preferences/1/');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Missing required parameter: preference_id');
  });

  test('400: when user_id is missing from URL', async () => {
    const response = await request(app).delete('/api/user_preferences//3');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Missing required parameter: user_id');
  });
});

// TESTING DELETE API/events/:event_id ---------------------------------------------------

describe('DELETE /api/events/:event_id', () => {
  test('204: delete an event', async () => {
    const response = await request(app).delete('/api/events/2');
    expect(response.status).toBe(204);
  });

  test('204: delete an event and verify removal', async () => {
    await request(app).delete('/api/events/2');
    const response = await request(app).get('/api/events/2');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Event not found');
  });

  test('404: when event_id does not exist', async () => {
    const response = await request(app).delete('/api/events/999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Event not found');
  });

  test('400: for invalid event_id data format', async () => {
    const response = await request(app).delete('/api/events/abc');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('invalid event_id format');
  });

  test('400: when event_id is missing from URL', async () => {
    const response = await request(app).delete('/api/events/');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Missing required parameter: event_id');
  });
});

// TESTING DELETE API/events/:event_id/event_attendees/:user_id ---------------------------------------------------

describe('DELETE /api/events/:event_id/attendees/:user_id', () => {
  // Test for successful attendee removal
  test('200: successfully removes an attendee from the event', async () => {
    const response = await request(app).delete('/api/events/1/attendees/101');
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Attendee successfully removed from event');
  });

  // Test for invalid event_id
  test('400: returns an error when event_id is not a number', async () => {
    const response = await request(app).delete(
      '/api/events/invalid_id/attendees/101'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid event_id or user_id');
  });

  // Test for invalid user_id
  test('400: returns an error when user_id is not a number', async () => {
    const response = await request(app).delete(
      '/api/events/1/attendees/invalid_user'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid event_id or user_id');
  });

  // Test for non-existent event or user combination
  test('404: returns an error when the attendee is not found in the event', async () => {
    const response = await request(app).delete('/api/events/1/attendees/9999'); // Assuming user 9999 doesn't exist in event 1
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Attendee 9999 not found in event 1');
  });

  // Test for server error (e.g., database failure)
  test('500: returns a server error on failure', async () => {
    // Mocking an error in DB query
    jest.spyOn(global, 'removeAttendeeFromEvent').mockImplementation(() => {
      throw new Error('Database failure');
    });

    const response = await request(app).delete('/api/events/1/attendees/101');
    expect(response.status).toBe(500);
    expect(response.body.msg).toBe('Server error');
  });
});

// TESTING POST API/users ---------------------------------------------------

describe('POST /api/users', () => {
  test('201: successfully creates a new user', async () => {
    const reponse = await request(app).post('/api/users').send({
      username: 'Hellokitty3',
      password: 'sanrio123',
      email: 'hello.kitty@gmail.com',
    });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      username: expect.any(String),
      email: expect.any(String),
    });
    expect(new Date(response.body.created_at).toISOString()).toBe(
      response.body.created_at
    );
    expect(new Date(response.body.updated_at).toISOString()).toBe(
      response.body.updated_at
    );
  });

  test('400: when body to send is empty or missing', async () => {
    const response = await request(app).post('/api/users').send({});
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });

  test('400: when body when datatypes are invalid', async () => {
    const response = await request(app).post('/api/users').send({
      name: 500,
      username: 5,
      profile_url: 5,
      password: 5,
    });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });
});

// TESTING POST API/user_preferences/:user_id ---------------------------------------------------

describe('POST /api/user_preferences/:user_id', () => {
  test('201: successfully creates a new user preference', async () => {
    const reponse = await request(app).post('/api/user_preferences/2').send({
      user_id: 2,
      preference_type: 'comedy',
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      preference_id: 21,
      user_id: 2,
      preference_type: 'comedy',
    });
  });

  test('400: when body to send is empty or missing', async () => {
    const response = await request(app)
      .post('/api/user_preferences/2')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });

  test('400: when body when datatypes are invalid', async () => {
    const response = await request(app).post('/api/user_preferences/2').send({
      name: 500,
      username: 5,
      profile_url: 5,
      password: 5,
    });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });
});

// TESTING POST API/events ---------------------------------------------------

describe('POST /api/events', () => {
  // Test for successful event creation
  test('201: creates a new event successfully', async () => {
    const newEvent = {
      event_name: 'Tech Conference 2025',
      event_type: 'conference',
      event_date: '2025-05-10',
      event_cost: 100,
    };

    const response = await request(app).post('/api/events').send(newEvent);
    expect(response.status).toBe(201);
    expect(response.body.msg).toBe('Event created successfully');
    expect(response.body.event.event_name).toBe(newEvent.event_name);
    expect(response.body.event.event_type).toBe(newEvent.event_type);
    expect(response.body.event.event_date).toBe(newEvent.event_date);
    expect(response.body.event.event_cost).toBe(newEvent.event_cost);
  });

  // Test for missing required fields
  test('400: returns an error when required fields are missing', async () => {
    const incompleteEvent = {
      event_name: 'Music Festival',
      event_type: 'festival',
      // Missing event_date and event_cost
    };

    const response = await request(app)
      .post('/api/events')
      .send(incompleteEvent);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('All fields are required');
  });

  // Test for invalid event_date format
  test('400: returns an error when event_date is invalid', async () => {
    const invalidDateEvent = {
      event_name: 'Art Exhibition',
      event_type: 'exhibition',
      event_date: 'invalid-date', // Invalid date format
      event_cost: 50,
    };

    const response = await request(app)
      .post('/api/events')
      .send(invalidDateEvent);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid event_date');
  });

  // Test for server error (e.g., database failure)
  test('500: returns a server error on failure', async () => {
    // Mocking an error in DB query
    jest.spyOn(global, 'createNewEvent').mockImplementation(() => {
      throw new Error('Database failure');
    });

    const newEvent = {
      event_name: 'Food Festival',
      event_type: 'festival',
      event_date: '2025-07-10',
      event_cost: 30,
    };

    const response = await request(app).post('/api/events').send(newEvent);
    expect(response.status).toBe(500);
    expect(response.body.msg).toBe('Server error');
  });
});
