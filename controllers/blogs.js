const blogsRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const savedBLog = await blog.save()
    response.status(201).json(savedBLog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    //console.log(request.body)
    //console.log(body)

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    //console.log(blog)

    // tälle annetaan javascript-olio eikä Blog-olio
    // new parametri palauttaa muuttuneen olion kutsujalle
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

module.exports = blogsRouter