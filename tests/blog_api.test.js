const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')



beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogit palautetaan json muodossa', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('sovellus palauttaa oikean määrän JSON-muotoisia blogeja', async () => {
    const response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
    
    //expect(response.get('Content-Type')).toEqual(/application\/json/) // ei toimi
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('palautettavien blogien identifioivan kentä nimi on id', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(blog => blog.id)
    for (let i of ids) {
        expect(i).toBeDefined()
    }
    
})

test('uuden blogin lisäämisen jälkeen se löytyy tietokannasta', async () => {
    const newBlog = {
        title: "Parsing Html The Cthulhu Way",
        author: "Jeff Atwood",
        url: "https://blog.codinghorror.com/parsing-html-the-cthulhu-way/",
        likes: 1234
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const newBlogs = await helper.blogsInDB()
    expect(newBlogs).toHaveLength(helper.initialBlogs.length + 1)

    const titles = newBlogs.map(blog => blog.title)
    expect(titles).toContain('Parsing Html The Cthulhu Way')

    const authors = newBlogs.map(blog => blog.author)
    expect(authors).toContain('Jeff Atwood')

    const urls = newBlogs.map(blog => blog.url)
    expect(urls).toContain('https://blog.codinghorror.com/parsing-html-the-cthulhu-way/')
})

test('uuden blogin lisäämisen jäkeen blogeja löytyy tietokannasta yksi enemmän', async () => {
    const newBlog = {
        title: "Parsing Html The Cthulhu Way",
        author: "Jeff Atwood",
        url: "https://blog.codinghorror.com/parsing-html-the-cthulhu-way/",
        likes: 1234
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const newBlogs = await helper.blogsInDB()
    expect(newBlogs).toHaveLength(helper.initialBlogs.length + 1)
})

test('uuden lisätyn blogin likes-kentän arvo on annettu arvo', async () => {
    const uniqueName = `Parsing Html The Cthulhu Way - ${Date.now()}`
    const newBlog = {
        title: uniqueName,
        author: "Jeff Atwood",
        url: "https://blog.codinghorror.com/parsing-html-the-cthulhu-way/",
        likes: 1234
    }

    await api.post('/api/blogs').send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const newBlogs = await helper.blogsInDB()
    console.log(newBlogs)
    const selectedBlog = newBlogs.find(blog => blog.title === uniqueName)
    console.log(selectedBlog)
    expect(selectedBlog.likes).toBe(1234)
})

test('jos kentälle likes ei anneta arvoa, sen arvoksi asetetaan 0 (nolla)', async () => {
    const uniqueName = `Parsing Html The Cthulhu Way - ${Date.now()}`
    const dummyBlog = {
        title: uniqueName,
        author: "Jeff Atwood",
        url: "https://blog.codinghorror.com/parsing-html-the-cthulhu-way/"
    }

    await api.post('/api/blogs').send(dummyBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    // vai etsisikö suoraan oikean blogin?
    const newBlogs = await helper.blogsInDB()
    const selectedBlog = newBlogs.find(blog => blog.title === uniqueName)
    expect(selectedBlog.likes).toBe(0)
})

afterAll(async () => {
    await mongoose.connection.close()
})