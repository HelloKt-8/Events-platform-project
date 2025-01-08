const db = require('../db/connection');

exports.selectUsers = async () => {
  const sqlQuery = 'SELECT * FROM users;';
  const users = await db.query(sqlQuery);
  return users.rows;
};

exports.selectUser = async (user_id) => {
  const sqlQuery = 'SELECT * FROM users WHERE user_id = $1;';
  const user = await db.query(sqlQuery, [user_id]);
  if (user.rows.length === 0) {
    return Promise.reject({
      status: 400,
      msg: `User not found for user_id: ${user_id}`,
    });
  }
  return user.rows[0];
};
