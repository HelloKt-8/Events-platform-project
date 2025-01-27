const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())

const { 
    getUsers, 
    getUserId,
    getUserPreferences,
    getUserActivity,
    getEvents,
    getEventAttendees,
    patchUser,
    patchEvent,
    patchUserPreferences,
    deleteUser,
    deleteUserPreference,
    deleteEvent,
    deleteEventAttendee,
    createUser,
    createPreferences,
    createEvent,
    addEventAttendee
 } = require('./controllers/controllers');


app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserId);
app.get('/api/user_preferences', getUserPreferences)
app.get('/api/user_activity', getUserActivity)
app.get('/api/events', getEvents)
app.get('/api/event_attendees/:event_id', getEventAttendees)

app.patch('/api/users/:user_id', patchUser)
app.patch('/api/events/:event_id', patchEvent)
app.patch('/api/user_preferences/:user_id/:preference_id', patchUserPreferences)

app.delete('/api/users/:user_id', deleteUser)
app.delete('/api/user_preferences/:user_id/:preference_id', deleteUserPreference)
app.delete('/api/events/:event_id', deleteEvent)
app.delete('/api/event_attendees/:event_id/:user_id', deleteEventAttendee);

app.post('/api/users', createUser)
app.post('/api/user_preferences/:user_id', createPreferences)
app.post('/api/events', createEvent)
app.post('/api/event_attendees/:event_id/:user_id', addEventAttendee);


app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Bad Request" });
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
  });

  app.get('/', (req, res) => {
    res.send('Hello, Railway!');
  });


  module.exports = app;
