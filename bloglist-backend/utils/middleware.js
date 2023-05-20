// kopioidaan notes-backendin middlewaret aluksi
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body   ', request.body)
  logger.info(Date())
  logger.info('---')
  next()
}

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint '})
// }

const errorHandler = (error, request, response, next) => {
  logger.error('errorHandler-middleware:')
  logger.error(error.message)
  if (error.name === 'CastError') {
    // PUT
    //return response.status(400).send({ error: `Error while updating likes field: likes must be a number`})
    return response.status(400).send({ error: `Error: ${error.name}: ${error.message}` })
  } else if (error.name === 'ValidationError') {
    // https://mongoosejs.com/docs/validation.html#validation-errors
    logger.error('errorHandler-middleware: mongoose ValidationError')
    if (error.errors.content) {
      // kommentin validaatiovirhe
      return response.status(400).send(error)
    } else if (error.errors.likes) {
      //logger.error(error.errors.likes.name) // CastError
      logger.error(error.errors.likes.message)
      return response.status(400).send({ error: `likes field must be a number` })
    } else if (error.errors.url) {
      logger.error(error.errors.url.message)
      return response.status(400).send({ error: `url field can't be empty` })
    } else if (error.errors.title) {
      logger.error(error.errors.title.message)
      return response.status(400).send({ error: `title field can't be empty` })
    } else if (error.errors.username.message === 'Username must have at least 3 characters') {
      logger.error(error.errors.username.message)
      return response.status(400).send({
        error: `Username must have at least 3 characters (given username was: '${error.errors.username.value}')`,
      })
    }
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    if (error.message === 'jwt must be provided') {
      logger.error(`Error: ${error.name}: ${error.message}`)
      return response.status(401).send({ error: 'token missing or invalid' })
    } else if (error.message === 'invalid signature') {
      logger.error(`Error: ${error.name}: ${error.message}`)
      return response.status(401).send({ error: 'invalid signature' })
    }
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (user) {
    request.user = user
  }
  next()
}

module.exports = {
  requestLogger,
  //unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
