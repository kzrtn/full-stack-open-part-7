const logger = require('./logger.js')
const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

/*
const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method)
  logger.info('Path: ', req.path)
  logger.info('---')
  next()
}
*/

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown enpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error(err)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: `Username already taken: ${err.message}` })
  } else if (err.name === 'CastError') {
    return res.status(400).json({ error: `Malformatted id: ${err.message}`})
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: `JWT token missing/invalid: ${err.message}`})
  }

  next(err)
}

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')

  if (auth && auth.startsWith('Bearer ')) {
    req.token = auth.replace('Bearer ', '')
  } else {
    req.token = null
  }
  
  next()
}

const userExtractor = async (req, res, next) => {
  const token = jwt.verify(req.token, process.env.SECRET)
  if(!token.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(token.id)
  if (!user) {
    return res.status(400).json({ error: 'user ID is missing or not valid'})
  }

  req.user = user
  next()
}

module.exports = {
  //requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}