const assert = require('node:assert')
const { describe, test, beforeEach, after } = require('node:test')

const { createSampleBlogs } = require('./test_helper.js')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const app = require('../app.js')
const mongoose = require('mongoose')
const supertest = require('supertest')

const api = supertest(app)

beforeEach(async () => {
  await createSampleBlogs()
})

describe('user logging in with', () => {
  test('valid credentials receives status 200', async () => {
    const testUser = {
      username: 'root',
      password: 'admin@12333',
    }

    const res = await api
      .post('/api/login')
      .send(testUser)
      .expect(200)
  })

  test('invalid credentials receives status 401', async () => {
    const testUser = {
      username: 'root',
      password: 'admin@12',
    }

    const res = await api
      .post('/api/login')
      .send(testUser)
      .expect(401)
  })
})


after(async () => {
  await mongoose.connection.close()
})