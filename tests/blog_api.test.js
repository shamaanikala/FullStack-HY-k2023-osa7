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

afterAll(async () => {
    await mongoose.connection.close()
})