const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery',false)

// T4.11*
// Käytetään Mongoosen default
//https://mongoosejs.com/docs/defaults.html
// Note: Mongoose only applies a default if the value of the path
// is strictly undefined.
// eli default arvo ei toimi, jos annetaan null

const blogSchema = mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Blog title is required']
    },
    author: String,
    url: {
      type: String,
      required: [true, 'Blog url is required']
    },
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