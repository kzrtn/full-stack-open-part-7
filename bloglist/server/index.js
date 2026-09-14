const app = require('./app.js')
const config = require('./utils/config.js')
const logger = require('./utils/logger.js')

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})