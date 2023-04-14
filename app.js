const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
//const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')


mongoose.set('strictQuery',false)
// TODO Virheenkäsittely tälle
mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


// // https://mongoosejs.com/docs/validation.html#validation-errors
// const errorHandler = (error,request,response,next) => {
//     logger.error(error.message)
//     //logger.error(error)
//     if (error.name === 'CastError') { // PUT
//         return response.status(400).send({ error: `Error while updating likes field: likes must be a number`})
//     }
//     else if (error.name === 'ValidationError') {
//         //console.log(error.errors)
//         if (error.errors.likes) {
//             //logger.error(error.errors.likes.name) // CastError
//             logger.error(error.errors.likes.message)
//             return response.status(400).send({error: `likes field must be a number`})
//         } else if (error.errors.url) {
//             logger.error(error.errors.url.message)
//             return response.status(400).send({error: `url field can't be empty`})
//         } else if (error.errors.title) {
//             logger.error(error.errors.title.message)
//             return response.status(400).send({error: `title field can't be empty`})
//         } else if (error.errors.username.message === 'Username must have at least 3 characters') {
//             logger.error(error.errors.username.message)
//             return response.status(400).send({ error: `Username must have at least 3 characters (given username was: '${error.errors.username.value}')`})
//         }
//         //console.log(`Required fields missing ${Object.keys(error.errors)}`)
//         //return response.status(400).send({error: `Required fields missing ${Object.keys(error.errors)}`})
//         return response.status(400).json({ error: error.message })
//     } else if (error.name === 'JsonWebTokenError') {
//         if (error.message === 'jwt must be provided') {
//             logger.error(`Error: ${error.name}: ${error.message}`)
//             return response.status(400).send({ error: 'The token must be provided in the header.' })
//         }
//     }
    

//     next(error)
// }

app.use(middleware.errorHandler)

module.exports = app