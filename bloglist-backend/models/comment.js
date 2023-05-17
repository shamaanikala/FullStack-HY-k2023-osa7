const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery', false)

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  },
  { timestamps: true }
)

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Comment', commentSchema)
