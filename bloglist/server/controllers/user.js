const bcrypt = require('bcrypt')
const logger = require('../utils/logger.js')
const User = require('../models/user.js')

const userRouter = require('express').Router()

userRouter.get('/', async (req, res) => {
  const results = await User
    .find({})
    .populate('blogs', { title: true, url: true, author: true, likes: true})

  res
    .status(200)
    .json(results)
})

userRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body
  const validPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

  if (!(validPasswordRegex).test(password)) {
    const error = new Error('invalid password')
    error.name = 'ValidationError'
    throw error
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name
  })

  const result = await user.save()

  res
    .status(200)
    .json(result)
})

module.exports = userRouter