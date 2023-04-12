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


mongoose.set('strictQuery',false)
// TODO Virheenkäsittely tälle
mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)


const errorHandler = (error,request,response,next) => {
    logger.error(error.message)
    //logger.error(error)
    if (error.name === 'CastError') { // PUT
        return response.status(400).send({ error: `Error while updating likes field: likes must be a number`})
    }
    else if (error.name === 'ValidationError') {
        //console.log(error.errors)
        if (error.errors.likes) {
            //logger.error(error.errors.likes.name) // CastError
            logger.error(error.errors.likes.message)
            return response.status(400).send({error: `likes field must be a number`})
        }
        //console.log(`Required fields missing ${Object.keys(error.errors)}`)
        return response.status(400).send({error: `Required fields missing ${Object.keys(error.errors)}`})
    }
    

    next(error)
}

app.use(errorHandler)

module.exports = app