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

exports.selectUserPreferences = async (user_id, preference_type) => {
  const sqlQuery = user_id && preference_type ? 'SELECT * FROM user_preferences WHERE user_id = $1 AND preference_type = $2;' : 
  preference_type ? 'SELECT * FROM user_preferences WHERE preference_type = $1;' :
  user_id ? 'SELECT * FROM user_preferences WHERE user_id = $1;' :
  'SELECT * FROM user_preferences;'

  const params = user_id && preference_type ? [user_id, preference_type] : preference_type ? [preference_type] : user_id ? [user_id] : [];
  const result = await db.query(sqlQuery, params);
  return result.rows
}



exports.selectUserActivity = async (user_id) => {
  const sqlQuery = 'SELECT * FROM user_activity WHERE user_id = $1;';
  const userActivity = await db.query(sqlQuery, [user_id]);
  if (userActivity.rows.length === 0){
    return Promise.reject({
      status: 400,
      msg: `User Activity not found for user_id: ${user_id}`,
    })
  }
  return userActivity.rows[0]
}

exports.selectEvents = async () => {
  const sqlQuery = 'SELECT * FROM events'
}