const blogsRouter = require('express').Router()
//const blog = require('../models/blog')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    //const blog = new Blog(request.body)
    const body = request.body
    // tilapäinen kovakoodattu userId T4.17
    if (!body.userId) {
        const dummyUsers = await User.find({})
        //console.log(dummyUsers)
        const dummyUserId = dummyUsers[0]._id.toString()
        //console.log(dummyUserId)
        body.userId = dummyUserId
    }
    
    
    const user = await User.findById(body.userId)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBLog = await blog.save()
    user.blogs = user.blogs.concat(savedBLog._id)
    await user.save()

    response.status(201).json(savedBLog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const { title, author, url, likes } = request.body

    //console.log(request.body)
    //console.log(body)

    // const blog = {
    //     title: body.title,
    //     author: body.author,
    //     url: body.url,
    //     likes: body.likes
    // }

    //console.log(blog)

    // tälle annetaan javascript-olio eikä Blog-olio
    // new parametri palauttaa muuttuneen olion kutsujalle
    //const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        {title, author, url, likes},
        { new: true, runValidators: true, context: 'query' })
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter