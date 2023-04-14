const blogsRouter = require('express').Router()
//const blog = require('../models/blog')
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    //const blog = new Blog(request.body)
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
    
    // tämä varmaan siirtyne middlewareen T4.20*
    // mutta miten tämän voisi lähettää errorHandler?
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    
    //const user = await User.findById(body.userId)
    const user = await User.findById(decodedToken.id)

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
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const blogId = request.params.id
    const blogToDelete = await Blog.findById(blogId)

    // blogin luoneen käyttäjän tieto on tietokannassa muodossa:
    // user: new ObjectId("6436a10e40980f329f08b00e")
    const blogToDeleteCreator = blogToDelete.user.toString()

    const deleterId = decodedToken.id.toString()

    console.log(`id token: ${decodedToken.id}`)
    console.log(`blogToDelete creator id: ${blogToDeleteCreator}`)
    console.log(`userid tokenista: ${deleterId}`)
    console.log(blogToDelete)
    
    if (blogToDeleteCreator === deleterId) {
        console.log('Tokenin ja blogin user.id on sama -> poistetaan')
    } else {
        console.log('Tokenin käyttäjällä ei ole oikeutta deletoida blogia')
        return response.status(401).json({ error: 'UserId wrong, cannot delete blog' })
    }

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