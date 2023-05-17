const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

const { requestLogger } = require('../utils/middleware')
const logger = require('../utils/logger')

commentsRouter.get('/', requestLogger, async (request, response) => {
  const comments = await Comment.find({}).populate('blog', { _id: 1 })
  response.json(comments)
})

module.exports = commentsRouter
