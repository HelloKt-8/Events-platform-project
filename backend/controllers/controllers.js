const { 
  selectUsers, 
  selectUser, 
  selectUserPreferences, 
  selectUserActivity,
  selectEvents,
  selectEventAttendees
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
    const { user_id } = req.params
    const user = await selectUser(user_id);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserPreferences = async (req, res, next) => {
  try {
    const { user_id, preference_type } = req.query
    const userPreferences = await selectUserPreferences(user_id, preference_type);
    res.status(200).send( { userPreferences });
  } catch (err) {
    next(err)
  }
}

exports.getUserActivity = async (req, res, next) => {
  try {
    const { user_id } = req.query
    const userActivity = await selectUserActivity(user_id);
    res.status(200).send( { userActivity })
  } catch (err) {
    next(err)
  }
}

exports.getEvents = async (req, res, next) => {
  try {
    const { event_id, event_type } = req.query
    const events = await selectEvents(event_id, event_type)
    res.status(200).send({ events })
  } catch (error) {
    next(error)
  }
}

exports.getEventAttendees = async (req, res, next) => {
  try {
    const { event_id } = req.params
    const eventAttendees = await selectEventAttendees(event_id)
    res.status(200).send({ eventAttendees })
  } catch(error) {
    console.error(error)
    next(error)
  }
}
