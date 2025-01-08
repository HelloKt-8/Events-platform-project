const format = require('pg-format');
const db = require('../connection');

const seed = ({
  usersData,
  userPreferencesData,
  userActvityData,
  eventsData,
  paymentsData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS users;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS user_preferences;`).then(() => {
        return db.query(`DROP TABLE IF EXISTS user_activity;`).then(() => {
          return db.query(`DROP TABLE IF EXISTS events`).then(() => {
            return db.query(`DROP TABLE IF EXISTS payments;`).then(() => {
              return db
                .query(
                  `
                            CREATE TABLE users (
                            user_id SERIAL PRIMARY KEY,
                            username VARCHAR(50) NOT NULL,
                            password VARCHAR(60) NOT NULL,
                            email VARCHAR(50) NOT NULL,
                            created_at TIMESTAMP NOT NULL,
                            updated_at TIMESTAMP NOT NULL);`
                )
                .then(() => {
                  return db
                    .query(
                      `
                                CREATE TABLE user_preferences (
                                preference_id SERIAL PRIMARY KEY,
                                user_id INT,
                                preference_type VARCHAR(50)
                                );`
                    )
                    .then(() => {
                      return db.query(`
                                    CREATE TABLE user_activity (
                                    activity_id SERIAL PRIMARY KEY,
                                    user_id INT,
                                    activity_type VARCHAR(50) NOT NULL,
                                    activity_timestamp TIMESTAMP)`);
                    })
                    .then(() => {
                      return db
                        .query(
                          `CREATE TABLE events (
                      event_id SERIAL PRIMARY KEY,
                      user_id INT,
                      event_name VARCHAR(100),
                      event_date DATE,
                      event_type VARCHAR(50),
                      payment_status VARCHAR(50))`
                        )
                        .then(() => {
                          return db.query(
                            `CREATE TABLE payments (
                          payment_id SERIAL PRIMARY KEY,
                          user_id INT,
                          event_id INT,
                          amount INT,
                          payment_status VARCHAR(50),
                          payment_method VARCHAR(50))`
                          );
                        });
                    });
                });
            });
          });
        });
      });
    })
    .then(() => {
      const insertUsersQueryStr = format(
        'INSERT INTO users (username, password, email, created_at, updated_at) VALUES %L;',
        usersData.map(({ username, password, email, created_at, updated_at }) => [
          username,
          password,
          email,
          created_at,
          updated_at,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      const insertUserPrefQueryStr = format(
        'INSERT INTO user_preferences (user_id, preference_type) VALUES %L;',
        userPreferencesData.map(({ user_id, preference_type }) => [
          user_id,
          preference_type,
        ])
      );
      const userPrefPromise = db.query(insertUserPrefQueryStr);

      const insertUserActivityQueryStr = format(
        'INSERT INTO user_activity (user_id, activity_type, activity_timestamp) VALUES %L;',
        userActvityData.map(({ user_id, activity_type, activity_timestamp }) => [
          user_id,
          activity_type,
          activity_timestamp,
        ])
      );
      const userActivityPromise = db.query(insertUserActivityQueryStr);

      const insertEventsQueryStr = format(
        'INSERT INTO events (user_id, event_name, event_date, event_type, payment_status) VALUES %L;',
        eventsData.map(
          ({ user_id, event_name, event_date, event_type, payment_status }) => [
            user_id,
            event_name,
            event_date,
            event_type,
            payment_status,
          ]
        )
      );
      const eventsPromise = db.query(insertEventsQueryStr);

      const insertPaymentQueryStr = format(
        'INSERT into payments (user_id, event_id, amount, payment_status, payment_method) VALUES %L;',
        paymentsData.map(
          ({ user_id, event_id, amount, payment_status, payment_method }) => [
            user_id,
            event_id,
            amount,
            payment_status,
            payment_method,
          ]
        )
      );
      const paymentsPromise = db.query(insertPaymentQueryStr);

      return Promise.all([
        usersPromise,
        userPrefPromise,
        userActivityPromise,
        eventsPromise,
        paymentsPromise,
      ]);
    });
};

module.exports = seed;
