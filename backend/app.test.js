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
        activity_timestamp: '2024-12-18T10:00:00.000Z',
      },
      {
        activity_id: 10,
        user_id: 3,
        activity_type: 'event add',
        activity_timestamp: '2024-12-18T10:10:00.000Z',
      },
      {
        activity_id: 11,
        user_id: 3,
        activity_type: 'preference delete',
        activity_timestamp: '2024-12-18T10:30:00.000Z',
      },
      {
        activity_id: 12,
        user_id: 3,
        activity_type: 'logout',
        activity_timestamp: '2024-12-18T11:00:00.000Z',
      },
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
  test.only('200: return an array for all events', async () => {
    const response = await request(app).get('/api/events').timeout(5000);
    expect(response.status).toBe(200);
    const { events } = response.body;
    expect(events.length).toBeGreaterThan(1);
    events.forEach((event) => {
      expect(event).toMatchObject({
        event_id: expect.any(Number),
        event_name: expect.any(String),
        event_date: expect.any(String),
        event_type: expect.any(String),
        event_cost: expect.any(Number),
      });
    });
  });

  test.only('200: return all events filtered by event_id', async () => {
    const response = await request(app).get('/api/events?event_id=5');
    expect(response.status).toBe(200);
    const { events } = response.body;
    expect(events).toMatchObject([
      {
        event_id: 5,
        event_name: 'Tech Innovation Webinar',
        event_type: 'conference',
        event_date: '2025-01-20T00:00:00.000Z',
        event_cost: 50,
      },
    ]);
  });

  test.only('200: return events filted by event_type', async () => {
    const response = await request(app).get('/api/events?event_type=party');
    expect(response.status).toBe(200);
    const { events } = response.body;
    expect(events).toMatchObject([
      {
        event_id: 4,
        event_name: 'Private Dinner Party',
        event_type: 'party',
        event_date: '2025-01-15T00:00:00.000Z',
        event_cost: 30,
      },
      {
        event_id: 10,
        event_name: 'Indie Music Showcase',
        event_type: 'party',
        event_date: '2025-02-20T00:00:00.000Z',
        event_cost: 25,
      },
    ]);
  });

  test.only('200: returns an empty array if valid event_id but no events', async () => {
    const response = await request(app).get('/api/events?event_id=100');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Event does not exist');
  });

  test.only('400, returns an error when testing for invalid query parameters', async () => {
    const response = await request(app).get('/api/events?event_id=abc');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });

  test.only('404: returns an error for non existent event', async () => {
    const response = await request(app).get(
      '/api/events?event_type=cheesecake'
    );
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Event does not exist');
  });
});

// TESTING API/EVENT_ATTENDEES/:event_id ---------------------------------------------------

describe('GET /event_attendees/:event_id', () => {
  // Test for valid event_id with attendees
  test.only('200: returns list of attendees for a valid event_id', async () => {
    const response = await request(app).get('/api/event_attendees/1');
    expect(response.status).toBe(200);
    const { eventAttendees } = response.body;
    expect(Array.isArray(eventAttendees)).toBe(true);
    expect(eventAttendees.length).toBeGreaterThan(0);
    eventAttendees.forEach((attendee) => {
      expect(attendee).toMatchObject(
        {
          event_id: 1,
          user_id: expect.any(Number),
          status: expect.any(String),
          payment_status: expect.any(String),
        },
        expect(
          attendee.payment_method === null ||
            typeof attendee.payment_method === 'string'
        )
      );
    });
  });

  // Test for invalid event_id
  test.only('400: returns an error when event_id is not a number', async () => {
    const response = await request(app).get('/api/event_attendees/invalid_id');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });

  // Test for non-existent event_id
  test.only('404: returns an error when event_id does not exist', async () => {
    const response = await request(app).get('/api/event_attendees/9999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      'Event does not exist or No attendees found for event_id: 9999'
    );
  });

  // Test for valid event_id but with no attendees
  test.only('404: returns an error when there are no attendees for the event_id', async () => {
    const response = await request(app).get('/api/event_attendees/7'); // Assuming event 2 has no attendees
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      'Event does not exist or No attendees found for event_id: 7'
    );
  });
});

// TESTING PATCH API/USERS/:USER_ID ---------------------------------------------------
describe('PATCH/api/users/user_id', () => {
  test.only('200: successfully updates one single changeable item of user information', async () => {
    const response = await request(app).patch('/api/users/1').send({
      username: 'johndoe777',
    });
    expect(response.status).toBe(200);
    const { updatedUser } = response.body;
    expect(updatedUser).toMatchObject({
      user_id: 1,
      username: 'johndoe777',
      password: 'password123!',
      email: 'john.doe@example.com',
      user_type: 'staff',
    });
  });

  test.only('200: successfully updates multiple items of changeable user information', async () => {
    const response = await request(app).patch('/api/users/3').send({
      username: 'coolgamer500',
      password: 'cheesecake2024',
      email: 'coolgamer@gmail.com',
    });
    expect(response.status).toBe(200);
    const { updatedUser } = response.body;
    expect(updatedUser).toMatchObject({
      user_id: 3,
      username: 'coolgamer500',
      password: 'cheesecake2024',
      email: 'coolgamer@gmail.com',
      user_type: 'admin',
    });
  });

  test.only('400: responds with an appropriate error message when not changing anything', async () => {
    const response = await request(app).patch('/api/users/1').send({});
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });

  test.only('404: responds with an appropriate error message when user_id is valid but does not exist', async () => {
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

  test.only('400: responds with an appropriate error message when user_id is not valid', async () => {
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

  test.only('400: responds with an appropriate error message when passed an invalid type in the body', async () => {
    const response = await request(app)
      .patch('/api/users/5')
      .send({ username: 1234 });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });
});

// TESTING PATCH API/EVENTS/:event_id ---------------------------------------------------
describe('PATCH/api/events/:event_id', () => {
  test.only('200: successfully updates one single changeable item of event information', async () => {
    const response = await request(app).patch('/api/events/10').send({
      event_name: 'Political Party',
    });
    expect(response.status).toBe(200);
    const { updatedEvent } = response.body;
    expect(updatedEvent).toMatchObject({
      event_id: 10,
      event_name: 'Political Party',
      event_date: '2025-02-20T00:00:00.000Z',
      event_type: 'party',
      event_cost: 25,
    });
  });

  test.only('200: successfully updates multiple items of changeable event information', async () => {
    const response = await request(app).patch('/api/events/8').send({
      event_name: 'Animal feeding',
      event_cost: 7,
    });
    expect(response.status).toBe(200);
    const { updatedEvent } = response.body;
    expect(updatedEvent).toMatchObject({
      event_id: 8,
      event_name: 'Animal feeding',
      event_type: 'animals',
      event_date: '2025-02-10T00:00:00.000Z',
      event_cost: 7,
    });
  });

  test.only('404: returns error when event ID is not found', async () => {
    const response = await request(app).patch('/api/events/999').send({
      event_name: 'Non-existent Event',
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      msg: 'Event_id does not exist: 999',
    });
  });

  test.only('400: returns error when required fields are missing', async () => {
    const response = await request(app).patch('/api/events/4').send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      msg: 'Bad request: invalid data format',
    });
  });

  test.only('400: returns error when data type is invalid', async () => {
    const response = await request(app).patch('/api/events/4').send({
      event_date: 'not-a-date',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      msg: 'Bad request: invalid data format',
    });
  });

  test.only('400: returns error when event ID is invalid format', async () => {
    const response = await request(app).patch('/api/events/abc').send({
      event_name: 'Invalid ID Format',
      event_date: 'not-a-date',
      event_cost: 'not-a-cost',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      msg: 'Bad request: invalid data format',
    });
  });
});

// TESTING PATCH API/user_preferences/:user_id ---------------------------------------------------
describe('PATCH/api/user_preferences/:user_id', () => {
  test.only('200: successfully updates one single changeable item of preference information', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/1/3')
      .send({
        preference_type: 'cheeseboards',
      });
    expect(response.status).toBe(200);
    const { updatedPreference } = response.body
    expect(updatedPreference).toEqual({
      preference_id: 3,
      user_id: 1,
      preference_type: 'cheeseboards',
    });
  });

  test.only('400: returns error when required fields are missing', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/4/13')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      msg: 'Bad request: invalid data format',
    });
  });

  test.only('400: returns error when data type is invalid', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/4/14')
      .send({
        preference_type: 324234, // Invalid date format
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      msg: 'Bad request: invalid data format',
    });
  });

  test.only('400: returns error when user ID is invalid format', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/abc/1')
      .send({
        event_name: 'Invalid ID Format',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      msg: 'Bad request: invalid data format',
    });
  });

  test.only('404: returns error when user does not exist', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/9999/1')
      .send({
        preference_type: 'cheeseboards',
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      msg: 'User_id or preference_id not found',
    });
  });

  test.only('404: returns error when preference does not exist', async () => {
    const response = await request(app)
      .patch('/api/user_preferences/1/9999')
      .send({
        preference_type: 'cheeseboards',
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      msg: 'User_id or preference_id not found',
    });
  });
});

// TESTING DELETE API/users/:user_id ---------------------------------------------------

describe('DELETE /api/users/:user_id', () => {
  test.only('204: delete a user', async () => {
    const response = await request(app).delete('/api/users/1');
    expect(response.status).toBe(204);
  });

  test.only('204: delete a user and verify removal', async () => {
    await request(app).delete('/api/users/1');
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 1');
  });

  test.only('404: when user_id does not exist', async () => {
    const response = await request(app).delete('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 999');
  });

  test.only('400: for invalid user_id data format', async () => {
    const response = await request(app).delete('/api/users/notvalidid');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

// TESTING DELETE API/user_preference/:user_id/:preference_id ---------------------------------------------------

describe('DELETE /api/user_preference/:user_id/:preference_id', () => {
  test.only('204: delete a users preference', async () => {
    const response = await request(app).delete('/api/user_preferences/1/3');
    expect(response.status).toBe(204);
    expect(response.body).toEqual({})
  });

  // test.only('404: when user_id does not exist', async () => {
  //   const response = await request(app).delete('/api/user_preference/999/5');
  //   expect(response.status).toBe(404);
  //   expect(response.body.msg).toBe('User or user preference not found');
  // });

  test.only('400: for invalid user_id data format', async () => {
    const response = await request(app).delete(
      '/api/user_preferences/notvalidid/5'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid data format');
  });

  test.only('400: for invalid preference_id data format', async () => {
    const response = await request(app).delete(
      '/api/user_preferences/2/invalidid'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid data format');
  });

  test.only('404: when preference_id does not exist for a valid user_id', async () => {
    const response = await request(app).delete('/api/user_preferences/1/999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      'User or user preference not found'
    );
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
