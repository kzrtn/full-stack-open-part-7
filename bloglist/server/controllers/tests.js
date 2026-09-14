const testRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

testRouter.post('/reset', async (req, res) => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  res.status(204).end()
})

testRouter.post('/reset-users', async (req, res) => {
  await User.deleteMany({})
  res.status(204).end()
})

testRouter.post('/reset-blogs', async (req, res) => {
  await Blog.deleteMany({})
  res.status(204).end()
})
module.exports = testRouter