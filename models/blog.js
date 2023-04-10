const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery',false)

// T4.11*
// Käytetään Mongoosen default
//https://mongoosejs.com/docs/defaults.html
// Note: Mongoose only applies a default if the value of the path
// is strictly undefined.

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: {
      type: Number,
      default: 0
    } 
  })

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Blog', blogSchema)