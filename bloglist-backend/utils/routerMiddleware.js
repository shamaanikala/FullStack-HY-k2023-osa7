// https://expressjs.com/en/guide/using-middleware.html#middleware.router
const commentsRouter = require('express').Router()

commentsRouter.use('/api/blogs/:id/comments', (request, response, next) => {
  next()
})

commentsRouter.use('/api/blogs/:id/comments', (request, response, next) => {
  const blogId = request.params.id
  console.log(`Redirecting /api/blogs/${blogId}/comments -> /api/comments/${blogId}`)
  response.redirect(`/api/comments/${blogId}`)
  next() // tämä tarvitaan
})

module.exports = commentsRouter
