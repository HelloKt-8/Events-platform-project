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

exports.selectEventByName = async (event_name) => {
  const sqlQuery = 'SELECT * FROM events WHERE event_name ILIKE $1 LIMIT 10;';
  const eventName = await db.query(sqlQuery, [`%${event_name}%`]);
  
  if(eventName.rows.length === 0){
    return Promise.reject({
      status: 404, 
      msg: `Event does not exist`
    })
  }
  return eventName.rows;
}

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
  event_time,
  end_time,
  event_type,
  event_cost,
  event_location,
  event_img,
  description
) => {
  if (!event_id || isNaN(Number(event_id))) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: invalid event_id format',
    });
  }

  const checkEvent = await db.query(
    `SELECT * FROM events WHERE event_id = $1`,
    [event_id]
  );

  if (checkEvent.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `Event_id does not exist: ${event_id}`,
    });
  }

  const queryValues = [];
  const updateFields = [];

  // Dynamically build the update query to only modify provided fields
  if (event_name) {
    updateFields.push(`event_name = $${queryValues.length + 1}`);
    queryValues.push(event_name);
  }
  if (event_date) {
    updateFields.push(`event_date = $${queryValues.length + 1}`);
    queryValues.push(event_date);
  }
  if (event_time) {
    updateFields.push(`event_time = $${queryValues.length + 1}`);
    queryValues.push(event_time);
  }
  if (end_time) {
    updateFields.push(`end_time = $${queryValues.length + 1}`);
    queryValues.push(end_time);
  }
  if (event_type) {
    updateFields.push(`event_type = $${queryValues.length + 1}`);
    queryValues.push(event_type);
  }
  if (event_cost !== undefined) {
    updateFields.push(`event_cost = $${queryValues.length + 1}`);
    queryValues.push(event_cost);
  }
  if (event_location) {
    updateFields.push(`event_location = $${queryValues.length + 1}`);
    queryValues.push(event_location);
  }
  if (event_img) {
    updateFields.push(`event_img = $${queryValues.length + 1}`);
    queryValues.push(event_img);
  }
  if (description) {
    updateFields.push(`description = $${queryValues.length + 1}`);
    queryValues.push(description);
  }

  if (updateFields.length === 0) {
    return Promise.reject({
      status: 400,
      msg: 'No valid fields provided for update',
    });
  }

  queryValues.push(event_id);
  const sqlQuery = `
    UPDATE events SET ${updateFields.join(', ')}
    WHERE event_id = $${queryValues.length} RETURNING *;
  `;

  const result = await db.query(sqlQuery, queryValues);
  return result.rows[0];
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

exports.makeEvent = async (
  event_name, 
  event_type, 
  event_date, 
  event_time, 
  end_time, 
  event_cost, 
  event_location, 
  event_img, 
  description
) => {
  if (
    typeof event_name !== 'string' ||
    typeof event_type !== 'string' ||
    typeof event_date !== 'string' ||
    (event_time !== null && typeof event_time !== 'string') ||
    (end_time !== null && typeof end_time !== 'string') ||
    isNaN(Number(event_cost)) ||
    (event_location !== null && typeof event_location !== 'string') ||
    (event_img !== null && typeof event_img !== 'string') ||
    (description !== null && typeof description !== 'string')
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid data or missing fields',
    });
  }

  const sqlQuery = `
    INSERT INTO events (
      event_name, event_type, event_date, event_time, end_time, 
      event_cost, event_location, event_img, description
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const event = await db.query(sqlQuery, [
    event_name,
    event_type,
    event_date,
    event_time,
    end_time,
    event_cost,
    event_location,
    event_img,
    description
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
