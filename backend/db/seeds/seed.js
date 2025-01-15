const format = require('pg-format');
const db = require('../connection');

const seed = ({
  usersData,
  userPreferencesData,
  userActvityData,
  eventsData,
  eventAttendeesData, // New data for event attendees
}) => {
  return db
    .query(`DROP TABLE IF EXISTS users;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS user_preferences;`).then(() => {
        return db.query(`DROP TABLE IF EXISTS user_activity;`).then(() => {
          return db.query(`DROP TABLE IF EXISTS events;`).then(() => {
            return db.query(`DROP TABLE IF EXISTS event_attendees;`).then(() => {
              return db
                .query(
                  `
                    CREATE TABLE users (
                      user_id SERIAL PRIMARY KEY,
                      username VARCHAR(50) NOT NULL,
                      password VARCHAR(60) NOT NULL,
                      email VARCHAR(50) NOT NULL,
                      user_type VARCHAR(20) CHECK (user_type IN ('staff', 'member', 'admin')) NOT NULL,
                      created_at TIMESTAMP NOT NULL,
                      updated_at TIMESTAMP NOT NULL
                    );`
                )
                .then(() => {
                  return db.query(
                    `
                      CREATE TABLE user_preferences (
                        preference_id SERIAL PRIMARY KEY,
                        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
                        preference_type VARCHAR(50)
                      );`
                  )
                  .then(() => {
                    return db.query(
                      `
                        CREATE TABLE user_activity (
                          activity_id SERIAL PRIMARY KEY,
                          user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
                          activity_type VARCHAR(50) NOT NULL,
                          activity_timestamp TIMESTAMP
                        );`
                    )
                    .then(() => {
                      return db.query(
                        `
                          CREATE TABLE events (
                            event_id SERIAL PRIMARY KEY,
                            event_name VARCHAR(100),
                            event_type VARCHAR(50),
                            event_date DATE,
                            event_cost INT,  -- Added cost for the event
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                          );`
                      )
                      .then(() => {
                        return db.query(
                          `
                            CREATE TABLE event_attendees (
                              event_attendee_id SERIAL PRIMARY KEY,
                              event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
                              user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
                              status VARCHAR(20) CHECK (status IN ('confirmed', 'pending', 'canceled')) DEFAULT 'pending',
                              payment_status VARCHAR(50),
                              payment_method VARCHAR(50),
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            );`
                        );
                      });
                    });
                  });
                });
            });
          });
        });
      });
    })
    .then(() => {
      // Insert Data into Users Table
      const insertUsersQueryStr = format(
        'INSERT INTO users (username, password, email, user_type, created_at, updated_at) VALUES %L;',
        usersData.map(({ username, password, email, user_type, created_at, updated_at }) => [
          username,
          password,
          email,
          user_type,
          created_at,
          updated_at,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      // Insert Data into User Preferences Table
      const insertUserPrefQueryStr = format(
        'INSERT INTO user_preferences (user_id, preference_type) VALUES %L;',
        userPreferencesData.map(({ user_id, preference_type }) => [
          user_id,
          preference_type,
        ])
      );
      const userPrefPromise = db.query(insertUserPrefQueryStr);

      // Insert Data into User Activity Table
      const insertUserActivityQueryStr = format(
        'INSERT INTO user_activity (user_id, activity_type, activity_timestamp) VALUES %L;',
        userActvityData.map(({ user_id, activity_type, activity_timestamp }) => [
          user_id,
          activity_type,
          activity_timestamp,
        ])
      );
      const userActivityPromise = db.query(insertUserActivityQueryStr);

      // Insert Data into Events Table
      const insertEventsQueryStr = format(
        'INSERT INTO events (event_name, event_type, event_date, event_cost) VALUES %L;',
        eventsData.map(({ event_name, event_type, event_date, event_cost }) => [
          event_name,
          event_type,
          event_date,
          event_cost,
        ])
      );
      const eventsPromise = db.query(insertEventsQueryStr);

      // Insert Data into Event Attendees Table
      const insertEventAttendeesQueryStr = format(
        'INSERT INTO event_attendees (event_id, user_id, status, payment_status, payment_method) VALUES %L;',
        eventAttendeesData.map(({ event_id, user_id, status, payment_status, payment_method }) => [
          event_id,
          user_id,
          status,
          payment_status,
          payment_method,
        ])
      );
      const eventAttendeesPromise = db.query(insertEventAttendeesQueryStr);

      return Promise.all([
        usersPromise,
        userPrefPromise,
        userActivityPromise,
        eventsPromise,
        eventAttendeesPromise,
      ]);
    });
};

module.exports = seed;
