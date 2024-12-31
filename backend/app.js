const express = require("express")
const cors = require("cors")

const app = express()

const {getUsers} = require("./controllers/controllers")

//endpoints
app.get("/api/users", getUsers)