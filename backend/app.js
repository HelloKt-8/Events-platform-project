const express = require('express');
const cors = require('cors');

const app = express();

const { getUsers, getUserId } = require('./controllers/controllers');

//endpoints
app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserId);

module.exports = app;
