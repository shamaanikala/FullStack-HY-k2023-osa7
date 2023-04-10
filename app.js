const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
//const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


mongoose.set('strictQuery',false)
// TODO Virheenkäsittely tälle
mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs/', blogsRouter)


const errorHandler = (error,request,response,next) => {
    logger.error(error.message)

    if (error.name === 'ValidationError') {
        //console.log(error.errors)
        //console.log(Object.keys(error.errors))
        //console.log(`Required fields missing ${Object.keys(error.errors)}`)
        return response.status(400).send(`Required fields missing ${Object.keys(error.errors)}`)
    }

    next(error)
}

app.use(errorHandler)

module.exports = app