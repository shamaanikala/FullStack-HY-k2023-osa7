// https://expressjs.com/en/guide/using-middleware.html#middleware.router
const commentsRouter = require('express').Router()

commentsRouter.use('/api/blogs/:id/comments', (request, response, next) => {
  console.log('yritetään /api/blogs/:id/comments')
  next()
})

commentsRouter.get('/api/blogs/:id/comments', (request, response, next) => {
  console.log(request.params.id)
  const blogId = request.params.id
  return response.redirect(`/api/comments/${blogId}`)
})

module.exports = commentsRouter
