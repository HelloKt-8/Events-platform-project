const express = require('express');
const cors = require('cors');

const app = express();

const { 
    getUsers, 
    getUserId,
    getUserPreferences,
    getUserActivity,
    getEvents,
    getPaymentStatusId,
    patchUser,
    patchEvent,
    patchUserPreferences,
    deleteUser,
    deleteUserPreference,
    deleteEvent,
    createUser,
    createPreferences,
    createEvent
 } = require('./controllers/controllers');

//endpoints
app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserId);
app.get('/api/user_preferences', getUserPreferences)
app.get('/api/user_activity/:user_id', getUserActivity)
app.get('/api/events', getEvents)
app.get('/api/payments/:event_id', getPaymentStatusId)

app.patch('/api/users/:user_id', patchUser)
app.patch('/api/events/:event_id', patchEvent)
app.patch('/api/users/:user_id/user_preferences', patchUserPreferences)

app.delete('/api/users/:user_id', deleteUser)
app.delete('/api/user_preferences/:user_preference_id', deleteUserPreference)
app.delete('/api/events/:event_id', deleteEvent)

app.post('/api/users', createUser)
app.post('/api/user_preferences', createPreferences)
app.post('/api/events', createEvent)

module.exports = app;
