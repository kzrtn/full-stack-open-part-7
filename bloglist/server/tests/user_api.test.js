const { after, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app.js')
const User = require('../models/user.js')
const { createSampleUsers, createSampleBlogs, usersInDb, blogsInDb, sendUser } = require('./test_helper.js')

const api = supertest(app)

beforeEach(async () => {
  await createSampleBlogs()
})

describe('creating user with', () => {
  test('valid credentials succeeds with status 200', async () => {
    const testUser = {
      username: 'testuser',
      password: 'Secret?1',
      name: 'Test'
    }
    const dbAtStart = await usersInDb()
    await sendUser(testUser).expect(200)
    const dbAtEnd = await usersInDb()
    const blogs = await blogsInDb()

    assert.strictEqual(dbAtEnd.length, dbAtStart.length + 1)
  })

  test('username that already exists fails with status 400', async () => {
    const testUser = {
      username: 'root',
      password: 'admin@12333',
      name: 'admin'
    }
    const dbAtStart = await usersInDb()
    await sendUser(testUser).expect(400)
    const dbAtEnd = await usersInDb()

    assert.strictEqual(dbAtEnd.length, dbAtStart.length)
  })

  test('too short username fails with status 400', async () => {
    const testUser = {
      username: 'j',
      password: 'Secret?1',
      name: 'John'
    }
    const dbAtStart = await usersInDb()
    await sendUser(testUser).expect(400)
    const dbAtEnd = await usersInDb()

    assert.strictEqual(dbAtEnd.length, dbAtStart.length)
  })

  test('no username fails with status 400', async () => {
    const testUser = {
      password: 'Secret?1',
      name: 'John'
    }
    const dbAtStart = await usersInDb()
    await sendUser(testUser).expect(400)
    const dbAtEnd = await usersInDb()

    assert.strictEqual(dbAtEnd.length, dbAtStart.length)
  })

  test('no name fails with status 400', async () => {
    const testUser = {
      username: 'testuser',
      password: 'Secret?1',
    }
    const dbAtStart = await usersInDb()
    await sendUser(testUser).expect(400)
    const dbAtEnd = await usersInDb()

    assert.strictEqual(dbAtEnd.length, dbAtStart.length)
  })

  test('no password fails with status 400', async () => {
    const testUser = {
      username: 'testuser123',
      name: 'John'
    }
    const dbAtStart = await usersInDb()
    await sendUser(testUser).expect(400)
    const dbAtEnd = await usersInDb()

    assert.strictEqual(dbAtEnd.length, dbAtStart.length)
  })

  test('invalid password fails with status 400', async () => {
    const testUser = {
      username: 'testuser123',
      name: 'John',
      password: 'arst'
    }
    const dbAtStart = await usersInDb()
    await sendUser(testUser).expect(400)
    const dbAtEnd = await usersInDb()

    assert.strictEqual(dbAtEnd.length, dbAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})