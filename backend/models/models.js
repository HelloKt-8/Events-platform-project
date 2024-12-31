const db = require('../db/connection')

exports.selectUsers = async () => {
    const sqlQuery = "SELECT * FROM users;";
    const users = await db.query(sqlQuery)
    return users.rows;

}