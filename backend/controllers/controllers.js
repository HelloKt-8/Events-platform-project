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
  removeUserPreference
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
    next(error)
  }
}

exports.patchUser = async (req, res, next) => {
const {user_id} = req.params

const { username, password, email } = req.body

try {
  const updatedUser = await changeUser(user_id, username, password, email)
  //console.log(updatedUser, 'CONTROLLER PATCH USER')
  res.status(200).send({ updatedUser })
} catch(error) {
  next(error)
}
}

exports.patchEvent = async (req, res, next) => {
  const {event_id} = req.params
  const { event_name, event_date, event_type, event_cost } = req.body
  
  try {
    const updatedEvent = await changeEvent(event_id, event_name, event_date, event_type, event_cost )
    res.status(200).send({ updatedEvent })
  } catch(error) {
    next(error)
  }
  }

exports.patchUserPreferences = async (req, res, next) => {
  const { user_id, preference_id } = req.params
  const { preference_type } = req.body
//console.log(user_id, preference_id, preference_type, 'CONTROLLER' )
  try {
    const updatedPreference = await changePreference(user_id, preference_id, preference_type)
   // console.log(updatedPreference)
    res.status(200).send({ updatedPreference })
  } catch(error){
    next(error)
  }
}

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
