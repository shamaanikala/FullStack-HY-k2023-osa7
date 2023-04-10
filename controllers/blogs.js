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

    // blog
    //     .save()
    //     .then(result => {
    //         response.status(201).json(result)
    //     })
})

module.exports = blogsRouter