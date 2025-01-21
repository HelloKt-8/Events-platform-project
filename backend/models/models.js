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
  const sqlQuery = 'SELECT * FROM event_attendees WHERE event_id = $1;';
  const eventAttendees = await db.query(sqlQuery, [event_id]);
  if (eventAttendees.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `Event does not exist or No attendees found for event_id: ${event_id}`,
    });
  }
  return eventAttendees.rows;
};

exports.changeUser = async (user_id, username, password, email) => {
  if (
    (!username && !password && !email) ||
    isNaN(Number(user_id)) ||
    (username && typeof username !== 'string') ||
    (email && typeof email !== 'string') ||
    (password && typeof password !== 'string')
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: invalid data format',
    });
  }

  const checkUser = await db.query(
    `SELECT * FROM USERS WHERE user_id = ${user_id}`
  );
  if (checkUser.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `user_id does not exist: ${user_id}`,
    });
  } else {
    const queryValues = [user_id, username, password, email];
    const sqlQuery = `UPDATE users SET 
username = COALESCE($2, username),
password = COALESCE($3, password),
email = COALESCE($4, email) 
WHERE user_id = $1 RETURNING *;`;
    const result = await db.query(sqlQuery, queryValues);

    return result.rows[0];
  }
};

exports.changeEvent = async (
  event_id,
  event_name,
  event_date,
  event_type,
  event_cost
) => {
  if (
    (!event_name && !event_date && !event_type && !event_cost) ||
    isNaN(Number(event_id)) ||
    (event_name && typeof event_name !== 'string') ||
    (event_date && typeof event_date !== 'date') ||
    (event_type && typeof event_type !== 'string') ||
    (event_cost && isNaN(Number(event_id)))
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: invalid data format',
    });
  }

  const checkEvent = await db.query(
    `SELECT * FROM events WHERE event_id = ${event_id}`
  );
  if (checkEvent.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `Event_id does not exist: ${event_id}`,
    });
  } else {
    const queryValues = [
      event_id,
      event_name,
      event_date,
      event_type,
      event_cost,
    ];
    const sqlQuery = `UPDATE events SET 
event_name = COALESCE($2, event_name),
event_date = COALESCE($3, event_date),
event_type = COALESCE($4, event_type),
event_cost = COALESCE($5, event_cost)
WHERE event_id = $1 RETURNING *;`;
    const result = await db.query(sqlQuery, queryValues);

    return result.rows[0];
  }
};

exports.changePreference = async (user_id, preference_id, preference_type) => {
  if (
    (!user_id && !preference_id) ||
    !preference_type ||
    isNaN(Number(user_id)) ||
    isNaN(Number(preference_id)) ||
    (preference_type && typeof preference_type !== 'string')
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: invalid data format',
    });
  }

  const checkPreferences = await db.query(
    `SELECT * FROM user_preferences WHERE user_id = $1 AND preference_id = $2;`,
    [user_id, preference_id]
  );

  if (checkPreferences.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `User_id or preference_id not found`,
    });
  } else {
    const queryValues = [user_id, preference_id, preference_type];
    const sqlQuery = `
  UPDATE user_preferences
  SET preference_type = COALESCE($3, preference_type)
  WHERE user_id = $1 AND preference_id = $2
  RETURNING *;
`;
    const result = await db.query(sqlQuery, queryValues);

    return result.rows[0];
  }
};

exports.removeUser = async (user_id) => {
  const sqlQuery = `DELETE FROM users WHERE user_id = $1 RETURNING *;`;
  const queryValues = [user_id];
  const deletedUser = await db.query(sqlQuery, queryValues);
  if (deletedUser.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `User not found for user_id: ${user_id}`,
    });
  } else {
    return deletedUser.rows[0];
  }
};

exports.removeUserPreference = async (user_id, preference_id) => {
  if (
    !user_id ||
    isNaN(Number(user_id)) ||
    !preference_id ||
    isNaN(Number(preference_id))
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid data format',
    });
  }

  const sqlQuery = `DELETE FROM user_preferences WHERE user_id = $1 AND preference_id = $2 RETURNING *;`;
  const queryValues = [user_id, preference_id];
  const deletedPreferences = await db.query(sqlQuery, queryValues);

  if (deletedPreferences.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: 'User or user preference not found',
    });
  }

  return deletedPreferences.rows[0];
};

exports.removeEvent = async (event_id) => {
  if (!event_id || isNaN(Number(event_id))) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid data format',
    });
  }
  const sqlQuery = `DELETE FROM events WHERE event_id = $1 RETURNING *;`;
  const queryValues = [event_id];
  const deletedEvent = await db.query(sqlQuery, queryValues);
  if (deletedEvent.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `Event not found`,
    });
  } else {
    return deletedEvent.rows[0];
  }
};

exports.removeEventAttendee = async (event_id, user_id) => {
  if (
    !event_id ||
    isNaN(Number(event_id)) ||
    !user_id ||
    isNaN(Number(user_id))
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid data format',
    });
  }
  const sqlQuery = `DELETE FROM event_attendees WHERE event_id = $1 AND user_id = $2 RETURNING *;`;
  const queryValues = [event_id, user_id];
  const deletedEvent = await db.query(sqlQuery, queryValues);
  if (deletedEvent.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `Event or user not found`,
    });
  } else {
    return deletedEvent.rows[0];
  }
};

exports.makeUser = async (username, password, email, user_type) => {
  if (!password || !username || !email || !user_type) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  if (
    typeof email !== 'string' ||
    typeof username !== 'string' ||
    typeof user_type !== 'string' ||
    typeof password !== 'string'
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid data format',
    });
  }

  const sqlQuery = `
        INSERT INTO users (username, password, email, user_type)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

  const user = await db.query(sqlQuery, [username, password, email, user_type]);
  return user.rows[0];
};

exports.makePreference = async (user_id, preference_type) => {
  if (
    !user_id ||
    isNaN(Number(user_id)) ||
    !preference_type ||
    typeof preference_type !== 'string'
  ) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  const sqlQuery = `
        INSERT INTO user_preferences (user_id, preference_type)
        VALUES ($1, $2)
        RETURNING *;
    `;

  const preference = await db.query(sqlQuery, [user_id, preference_type]);
  return preference.rows[0];
};

exports.makeEvent = async (event_name, event_type, event_date, event_cost) => {
  if (
    typeof event_name !== 'string' ||
    typeof event_type !== 'string' ||
    typeof event_date !== 'string' ||
    isNaN(Number(event_cost))
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid data or missing fields',
    });
  }

  const sqlQuery = `
        INSERT INTO events (event_name, event_type, event_date, event_cost)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

  const event = await db.query(sqlQuery, [
    event_name,
    event_type,
    event_date,
    event_cost,
  ]);
  console.log(event.rows[0]);
  return event.rows[0];
};

exports.insertEventAttendee = async (
  event_id,
  user_id,
  status,
  payment_status,
  payment_method
) => {
  if (
    !event_id ||
    isNaN(Number(event_id)) ||
    !user_id ||
    isNaN(Number(user_id))
  ) {
    throw { status: 400, msg: 'Invalid event_id or user_id format' };
  }

  const eventCheck = await db.query(
    `SELECT * FROM events WHERE event_id = $1`,
    [event_id]
  );
  if (eventCheck.rowCount === 0) {
    throw { status: 404, msg: 'Event not found' };
  }

  const userCheck = await db.query(`SELECT * FROM users WHERE user_id = $1`, [
    user_id,
  ]);
  if (userCheck.rowCount === 0) {
    throw { status: 404, msg: 'User not found' };
  }

  const duplicateCheck = await db.query(
    `SELECT * FROM event_attendees WHERE event_id = $1 AND user_id = $2`,
    [event_id, user_id]
  );
  if (duplicateCheck.rowCount > 0) {
    throw { status: 409, msg: 'Attendee already exists for this event' };
  }

  const validPaymentMethods = ['credit_card', 'paypal', 'cash'];
  if (!validPaymentMethods.includes(payment_method)) {
    throw { status: 400, msg: 'Invalid payment method' };
  }

  const insertQuery = `
    INSERT INTO event_attendees (event_id, user_id, status, payment_status, payment_method)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const queryValues = [
    event_id,
    user_id,
    status,
    payment_status,
    payment_method,
  ];

  const result = await db.query(insertQuery, queryValues);
  return result.rows[0];
};
