const format = require("pg-format");
const db = require("../connection");

const seed = ({
  usersData,
  userPreferencesData,
  userActvityData,
  eventsData,
  eventAttendeesData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS event_attendees;`)
    .then(() => db.query(`DROP TABLE IF EXISTS events;`))
    .then(() => db.query(`DROP TABLE IF EXISTS user_activity;`))
    .then(() => db.query(`DROP TABLE IF EXISTS user_preferences;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          password VARCHAR(60) NOT NULL,
          email VARCHAR(50) NOT NULL,
          user_type VARCHAR(20) CHECK (user_type IN ('staff', 'member', 'admin')) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE user_preferences (
          preference_id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
          preference_type VARCHAR(50)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE user_activity (
          activity_id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
          activity_type VARCHAR(50) NOT NULL,
          activity_timestamp TIMESTAMP
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE events (
          event_id SERIAL PRIMARY KEY,
          event_name VARCHAR(100),
          event_type VARCHAR(50),
          event_date DATE,
          event_cost INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          event_location VARCHAR(100)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE event_attendees (
          event_attendee_id SERIAL PRIMARY KEY,
          event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
          user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
          status VARCHAR(20) CHECK (status IN ('confirmed', 'pending', 'cancelled')) DEFAULT 'pending',
          payment_status VARCHAR(50),
          payment_method VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    })
    .then(async () => {
      const insertUsersQueryStr = format(
        'INSERT INTO users (username, password, email, user_type, created_at, updated_at) VALUES %L RETURNING user_id;',
        usersData.map(({ username, password, email, user_type, created_at, updated_at }) => [
          username,
          password,
          email,
          user_type,
          created_at,
          updated_at,
        ])
      );
      const usersResult = await db.query(insertUsersQueryStr);

      const insertUserPrefQueryStr = format(
        'INSERT INTO user_preferences (user_id, preference_type) VALUES %L;',
        userPreferencesData.map(({ user_id, preference_type }) => [user_id, preference_type])
      );

      const insertUserActivityQueryStr = format(
        'INSERT INTO user_activity (user_id, activity_type, activity_timestamp) VALUES %L;',
        userActvityData.map(({ user_id, activity_type, activity_timestamp }) => [
          user_id,
          activity_type,
          activity_timestamp,
        ])
      );

      const insertEventsQueryStr = format(
        'INSERT INTO events (event_name, event_type, event_date, event_cost, event_location) VALUES %L RETURNING event_id;',
        eventsData.map(({ event_name, event_type, event_date, event_cost, event_location }) => [
          event_name,
          event_type,
          event_date,
          event_cost,
          event_location,
        ])
      );
      const eventsResult = await db.query(insertEventsQueryStr);

      const updatedEventAttendeesData = eventAttendeesData.map((attendee) => {
        const validEventId = eventsResult.rows.find(
          (event) => event.event_id === attendee.event_id
        )?.event_id;
        return validEventId ? { ...attendee, event_id: validEventId } : attendee;
      });

      const insertEventAttendeesQueryStr = format(
        'INSERT INTO event_attendees (event_id, user_id, status, payment_status, payment_method) VALUES %L;',
        updatedEventAttendeesData.map(({ event_id, user_id, status, payment_status, payment_method }) => [
          event_id,
          user_id,
          status,
          payment_status,
          payment_method,
        ])
      );

      await Promise.all([
        db.query(insertUserPrefQueryStr),
        db.query(insertUserActivityQueryStr),
        db.query(insertEventAttendeesQueryStr),
      ]);
    });
};

module.exports = seed;
