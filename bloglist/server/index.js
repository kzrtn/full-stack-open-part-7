const express = require('express')
const path = require('path')
const app = require('./app.js')
const config = require('./utils/config.js')
const logger = require('./utils/logger.js')

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})