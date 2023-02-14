const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery',false)


const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })
  

// TODO Virheenkäsittely tälle
mongoose.connect(config.mongoUrl)

module.exports = mongoose.model('Blog', blogSchema)