const request = require("supertest")
const app = require('./app')
const db = require('./db/connection')
const seed = require('./db/seeds/seed')
const data = require('./db/data/test-data')
const jestSorted = require("jest-sorted")

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

