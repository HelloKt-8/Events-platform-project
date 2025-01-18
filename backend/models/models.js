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
      status: 404,
      msg: `User not found for user_id: ${user_id}`,
    });
  }
  return user.rows[0];
};

exports.selectUserPreferences = async (user_id, preference_type) => {
  const sqlQuery =
    user_id && preference_type
      ? 'SELECT * FROM user_preferences WHERE user_id = $1 AND preference_type = $2;'
      : preference_type
        ? 'SELECT * FROM user_preferences WHERE preference_type = $1;'
        : user_id
          ? 'SELECT * FROM user_preferences WHERE user_id = $1;'
          : 'SELECT * FROM user_preferences;';

  const params =
    user_id && preference_type
      ? [user_id, preference_type]
      : preference_type
        ? [preference_type]
        : user_id
          ? [user_id]
          : [];
  const result = await db.query(sqlQuery, params);
  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `User not found for user_id or preference_type`,
    });
  }
  return result.rows;
};

exports.selectUserActivity = async (user_id) => {
  const sqlQuery = 'SELECT * FROM user_activity WHERE user_id = $1;';
  const userActivity = await db.query(sqlQuery, [user_id]);
  if (userActivity.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `User_id or User_Activity not found`,
    });
  }
  return userActivity.rows;
};

exports.selectEvents = async (event_id, event_type) => {
  const sqlQuery =
    event_id && !event_type
      ? 'SELECT * FROM events where event_id = $1;'
      : !event_id && event_type
        ? 'SELECT * FROM events where event_type = $1;'
        : 'SELECT * FROM events';
  const params =
    event_id && !event_type
      ? [event_id]
      : !event_id && event_type
        ? [event_type]
        : [];
  const events = await db.query(sqlQuery, params);
  if (events.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Event does not exist',
    });
  }
  return events.rows;
};

exports.selectEventAttendees = async (event_id) => {
  const sqlQuery = 'SELECT * FROM event_attendees WHERE event_id = $1;'
  const eventAttendees = await db.query(sqlQuery, [event_id])
console.log(eventAttendees)
  if (eventAttendees.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `Event does not exist or No attendees found for event_id: ${event_id}`,
    });
  }
  return eventAttendees.rows

}