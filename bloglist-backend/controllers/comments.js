const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

const { requestLogger } = require('../utils/middleware')
const logger = require('../utils/logger')
const blog = require('../models/blog')

commentsRouter.get('/', requestLogger, async (request, response) => {
  const comments = await Comment.find({}).populate('blog', { title: 1 })
  response.json(comments)
})

commentsRouter.post('/', requestLogger, async (request, response) => {
  const body = request.body

  const comment = new Comment({
    content: body.content,
    blog: body.blog,
  })

  const savedComment = await comment.save()

  response.status(201).json(savedComment)
})

module.exports = commentsRouter
