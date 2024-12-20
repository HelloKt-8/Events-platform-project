const format = require("pg-format")
const db = require("../connection");

const seed = (({ usersData, userPreferencesData, userActvityData, eventsData, paymentsData  }) => {
    return db.query(`DROP TABLE IF EXISTS users;`).then(() => {
        return db.query(`DROP TABLE IF EXISTS user_preferences;`).then(() => {
            return db.query(`DROP TABLE IF EXISTS user_activity;`).then(() => {
                return db.query(`DROP TABLE IF EXISTS events`).then(() => {
                    return db.query(`DROP TABLE IF EXISTS payments;`).then(() => {
                        return db.query(`
                            CREATE TABLE users (
                            user_id SERIAL PRIMARY KEY,
                            username VARCHAR(50) NOT NULL,
                            password VARCHAR(60) NOT NULL,
                            email VARCHAR(50) NOT NULL,
                            created_at TIMESTAMP,
                            updated_at TIMESTAMP);`).then(() => {
                            return db.query(`
                                CREATE TABLE user_preferences (
                                preference_id SERIAL PRIMARY KEY,
                                user_id INT,
                                preference_type VARCHAR(50)
                                );`),then(() => )
                        })
                    })
                })
            })
    })})
})

