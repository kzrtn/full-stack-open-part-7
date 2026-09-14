const assert = require('node:assert')
const { describe, test, beforeEach, after } = require('node:test')

const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const app = require('../app.js')
const { createSampleBlogs, blogsInDb, createTestUser } = require('./test_helper.js')
const mongoose = require('mongoose')
const supertest = require('supertest')
const { read } = require('node:fs')

const api = supertest(app)

beforeEach(async () => {
  await createSampleBlogs()
})

describe('viewing blogs', () => {
  test('returns correct amount of blogs', async () => {
    const blogs = await blogsInDb()

    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, blogs.length)
  })

  test('unique identifier property of blog posts is named id', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    for (const blog of res.body) {
      assert(blog?.id)
    }
  })

  test('returns a single blog', async () => {
    const blog = (await blogsInDb())[0]
    delete blog.user.blogs

    const res = await api
      .get(`/api/blogs/${ blog.id }`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(res.body, blog)
  })
})

describe('making blog posts', () => {
  test('able to create a new blog post', async () => {
    const dbAtStart = await blogsInDb()
    const user = await createTestUser()

    const newBlog = {
      id: "123456789",
      title: "This is a new blog post",
      author: "Test author",
      url: "https://www.google.com/",
      likes: 0,
      user: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(201)

    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, dbAtStart.length + 1)
  })

  test('if likes is missing from post request, it defaults to 0', async () => {
    const user = await createTestUser()

    const newBlog = {
      title: "test post",
      author: "Test author",
      url: "https://www.google.com/",
      user: user._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(201)

    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const returnedBlog = res.body.find(blog => blog.title == 'test post')
    assert.strictEqual(returnedBlog.likes, 0)
  })

  test('response status 400 when blog is missing title', async () => {
    const user = await createTestUser()

    const newBlog = {
      author: "wow",
      url: "https://www.kfc.com",
      likes: 1,
      user: user._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(400)
  })

  test('response status 400 when blog is missing url', async () => {
    const user = await createTestUser()

    const newBlog = {
      title: "my title",
      author: "wow",
      likes: 10,
      user: user._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(400)
  })

  test('response status 401 when token is missing', async () => {
    const dbAtStart = await blogsInDb()

    await api
      .post('/api/blogs')
      .send({})
      .expect(401)

    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, dbAtStart.length)
  })

  test('response status 401 when token is malformed', async () => {
    const dbAtStart = await blogsInDb()
    const user = await createTestUser()

    const newBlog = {
      id: "123456789",
      title: "This is a new blog post",
      author: "Test author",
      url: "https://www.google.com/",
      likes: 0,
      user: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}12`)
      .expect(401)

    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, dbAtStart.length)
  })
})

describe('deleting blog posts', () => {
  test('response status 204 for successful single deletion', async () => {
    const dbAtStart = await blogsInDb()
    const user = await createTestUser()

    const newBlog = {
      title: "This is a new blog post",
      author: "Test author",
      url: "https://www.google.com/",
      likes: 0,
      user: user.id
    }

    const returnedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(201)

    await api
      .delete(`/api/blogs/${returnedBlog.body.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(204)
    
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('response status 404 if blog does not exist', async () => {
    const dbAtStart = await blogsInDb()
    const user = await createTestUser()

    const deleteBlog = {
      id: "5a422a851b54a676234d1123",
    }
    
    await api
      .delete(`/api/blogs/${deleteBlog.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(404)

    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, dbAtStart.length)
  })

  test('response status 400 if id is not a valid ObjectId', async () => {
    const dbAtStart = await blogsInDb()
    const user = await createTestUser()

    const deleteBlog = {
      id: 123,
    }

    await api
      .delete(`/api/blogs/${deleteBlog.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(400)

    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, dbAtStart.length)
  })
})

describe('updating blog posts', () => {
  test('update single post', async () => {
    const user = await createTestUser()

    const newBlog = {
      title: "This is a new blog post",
      author: "Test author",
      url: "https://www.google.com/",
      likes: 0,
      user: user.id
    }

    const returnedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(201)
    
    const updatedBlog = {
      likes: 1,
      id: returnedBlog.body.id
    }

    const expectedPost = {
      ...newBlog,
      ...updatedBlog,
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      }
    }

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedBlog)
      .expect(200)

    const res = await api
      .get(`/api/blogs/${ updatedBlog.id }`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(res.body, expectedPost)
  })

  test('response status 404 when blog does not exist', async () => {
    const user = await createTestUser()

    const newBlog = {
      title: "This is a new blog post",
      author: "Test author",
      url: "https://www.google.com/",
      likes: 0,
      user: user.id
    }

    const returnedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(201)
    
    const updatedBlog = {
      likes: 1,
      id: `6a844820d8b3366378b46123`
    }

    const expectedPost = {
      ...newBlog,
      id: returnedBlog.body.id,
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      }
    }

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedBlog)
      .expect(404)

    const res = await api
      .get(`/api/blogs/${returnedBlog.body.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(res.body, expectedPost)
  })

  test('response status 404 when id is not a valid ObjectId', async () => {
    const user = await createTestUser()

    await api
      .put(`/api/blogs/`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send({})
      .expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})