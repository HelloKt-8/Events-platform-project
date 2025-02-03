const {
  selectUsers,
  selectUser,
  selectUserPreferences,
  selectUserActivity,
  selectEvents,
  selectEventAttendees,
  changeUser,
  changeEvent,
  changePreference,
  removeUser,
  removeUserPreference,
  removeEvent,
  removeEventAttendee,
  makeUser,
  makePreference,
  makeEvent,
  insertEventAttendee
} = require('../models/models');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserId = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await selectUser(user_id);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserPreferences = async (req, res, next) => {
  try {
    const { user_id, preference_type } = req.query;
    const userPreferences = await selectUserPreferences(
      user_id,
      preference_type
    );
    res.status(200).send({ userPreferences });
  } catch (err) {
    next(err);
  }
};

exports.getUserActivity = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const userActivity = await selectUserActivity(user_id);
    res.status(200).send({ userActivity });
  } catch (err) {
    next(err);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const { event_id, event_type } = req.query;
    const events = await selectEvents(event_id, event_type);
    res.status(200).send({ events });
  } catch (error) {
    next(error);
  }
};

exports.getEventAttendees = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const eventAttendees = await selectEventAttendees(event_id);
    res.status(200).send({ eventAttendees });
  } catch (error) {
    next(error);
  }
};

exports.patchUser = async (req, res, next) => {
  const { user_id } = req.params;

  const { username, password, email } = req.body;

  try {
    const updatedUser = await changeUser(user_id, username, password, email);
    res.status(200).send({ updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.patchEvent = async (req, res, next) => {
  const { event_id } = req.params;
  const {
    event_name,
    event_date,
    event_time,
    end_time,
    event_type,
    event_cost,
    event_location,
    event_img,
    description,
  } = req.body;

  try {
    const updatedEvent = await changeEvent(
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
    );
    res.status(200).send({ updatedEvent });
  } catch (error) {
    next(error);
  }
};


exports.patchUserPreferences = async (req, res, next) => {
  const { user_id, preference_id } = req.params;
  const { preference_type } = req.body;
  try {
    const updatedPreference = await changePreference(
      user_id,
      preference_id,
      preference_type
    );

    res.status(200).send({ updatedPreference });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    await removeUser(user_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteUserPreference = async (req, res, next) => {
  const { user_id, preference_id } = req.params;
  try {
    await removeUserPreference(user_id, preference_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    await removeEvent(event_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteEventAttendee = async (req, res, next) => {
  const { event_id, user_id } = req.params;
  try {
    const response = await removeEventAttendee(event_id, user_id);
    res.status(200).send({ msg: 'Attendee successfully removed from event' });
  } catch (error) {
    next(error);
  }
};
exports.createUser = async (req, res, next) => {
  const { username, password, email, user_type } = req.body;
  try {
    const newUserDetails = await makeUser(username, password, email, user_type);
    res.status(201).send({
      user_id: newUserDetails.user_id,
      username: newUserDetails.username,
      password: newUserDetails.password,
      email: newUserDetails.email,
      user_type: newUserDetails.user_type,
    });
  } catch (error) {
    next(error);
  }
};

exports.createPreferences = async (req, res, next) => {
  const { user_id } = req.params;
  const { preference_type } = req.body;
  try {
    const newPreference = await makePreference(user_id, preference_type);
    res.status(201).send({
      preference_id: newPreference.preference_id,
      user_id: newPreference.user_id,
      preference_type: newPreference.preference_type,
    });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  const { 
    event_name, 
    event_type, 
    event_date, 
    event_time, 
    end_time, 
    event_cost, 
    event_location, 
    event_img, 
    description 
  } = req.body;

  try {
    const newEvent = await makeEvent(
      event_name,
      event_type,
      event_date,
      event_time,
      end_time,
      event_cost,
      event_location,
      event_img,
      description
    );

    res.status(201).send({
      msg: 'Event created successfully',
      event_id: newEvent.event_id,
      event_name: newEvent.event_name,
      event_type: newEvent.event_type,
      event_date: newEvent.event_date,
      event_time: newEvent.event_time,
      end_time: newEvent.end_time,
      event_cost: newEvent.event_cost,
      created_at: newEvent.created_at,
      updated_at: newEvent.updated_at,
      event_location: newEvent.event_location,
      event_img: newEvent.event_img,
      description: newEvent.description
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.addEventAttendee = async (req, res, next) => {
  const { event_id, user_id } = req.params;
  const { status, payment_status, payment_method } = req.body;

  try {
    if (!status || !payment_status || !payment_method) {
      throw { status: 400, msg: 'Missing required fields' };
    }

    const attendee = await insertEventAttendee(event_id, user_id, status, payment_status, payment_method);

    res.status(201).send({
      msg: 'Event attendee created successfully',
      attendee,
    });
  } catch (err) {
    next(err);
  }
};
