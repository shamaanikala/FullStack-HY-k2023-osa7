const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


describe('testit joihin käytetään perus alustusdataa', () => {
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
        const selectedBlog = newBlogs.find(blog => blog.title === uniqueName)
        //console.log(selectedBlog)
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

    // T4.11* tarkistuksia
    // vain undefined likes saa arvon 0 defaultista mongoosen kautta
    test('jos kentälle likes annetaan null arvo, sen arvo on null', async () => {
        const uniqueName = `Parsing Html The Cthulhu Way - ${Date.now()}`
        const dummyBlog = {
            title: uniqueName,
            author: "Jeff Atwood",
            url: "https://blog.codinghorror.com/parsing-html-the-cthulhu-way/",
            likes: null
        }

        await api.post('/api/blogs').send(dummyBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        // vai etsisikö suoraan oikean blogin?
        const newBlogs = await helper.blogsInDB()
        const selectedBlog = newBlogs.find(blog => blog.title === uniqueName)
        expect(selectedBlog.likes).toBe(null)
    })

    test('jos blogi ilman title-kenttää yritetään lisätä, palvelin vastaa statuskoodilla 400 Bad Request', async () => {
        const newBlog = {
            //title: "Parsing Html The Cthulhu Way",
            author: "Jeff Atwood",
            url: "https://blog.codinghorror.com/parsing-html-the-cthulhu-way/",
            likes: 1234
        }

        await api.post('/api/blogs').send(newBlog)
            .expect(400)
    })

    test('jos blogi ilman url-kenttää yritetään lisätä, palvelin vastaa statuskoodilla 400 Bad Request', async () => {
        const newBlog = {
            title: "Parsing Html The Cthulhu Way",
            author: "Jeff Atwood",
            //url: "https://blog.codinghorror.com/parsing-html-the-cthulhu-way/",
            likes: 1234
        }

        await api.post('/api/blogs').send(newBlog)
            .expect(400)
    })

    test('jos blogi ilman title- ja url-kenttää yritetään lisätä, palvelin vastaa statuskoodilla 400 Bad Request', async () => {
        const newBlog = {
            //title: "Parsing Html The Cthulhu Way",
            author: "Jeff Atwood",
            //url: "https://blog.codinghorror.com/parsing-html-the-cthulhu-way/",
            likes: 1234
        }

        await api.post('/api/blogs').send(newBlog)
            .expect(400)
    })

    describe('testataan blogin muokkausta PUT avulla', () => {
        test('blogin tykkäysten määrää voidaan kasvattaa yhdellä', async () => {
            const blogList = await helper.blogsInDB()
            const firstBlog = blogList[0]
    
            console.log(firstBlog.id)
            console.log(`Liket alussa: ${firstBlog.likes}`)
    
            let { title, author, url, likes } = firstBlog
    
            likes = likes + 1
    
            console.log({ title, author, url, likes})
    
            await api.put(`/api/blogs/${firstBlog.id}`)
                .send({ title, author, url, likes })
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            const updatedBlogList = await helper.blogsInDB()
            const updatedFirstBlog = updatedBlogList[0]
    
            console.log(updatedFirstBlog.id)
            console.log(`Liket lopussa: ${updatedFirstBlog.likes}`)
            
            expect(updatedFirstBlog.id).toBe(firstBlog.id)
            expect(updatedFirstBlog.likes).toBe(firstBlog.likes + 1)
        })
    }) 
    
})

describe('testit, joihin käytetään muokattua alustusdataa', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        const uniqueName = `Parsing Html The Cthulhu Way - ${Date.now()}`
        const dummyBlog = {
            title: uniqueName,
            author: "Jeff Atwood",
            url: "https://blog.codinghorror.com/parsing-html-the-cthulhu-way/"
        }

        const blogsList = [dummyBlog].concat(helper.initialBlogs)

        const blogObjects = blogsList.map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
    })

    test('uusi blogi yksikäsitteisellä nimellä löytyy tietokannasta', async () => {
        const blogsAdded = await helper.blogsInDB()
        const titles = blogsAdded.map(b => b.title)
        expect(titles[0]).toContain('Parsing Html The Cthulhu Way')
    })

    test('blogin poisto id:n perusteella onnistuu', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blogToDelete = blogsAtStart[0]

        uniqueTitle = blogToDelete.title
        
        await api.delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204) // No Content
        
        const blogsAtEnd = await helper.blogsInDB()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length) // eli alussa lisätty poistetaan

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(uniqueTitle)
    })

    // TODO olemattoman id:n poistaminen ei poista mitään ja palauttaa status
    test('olemattoman blogin poistoyritys id:n perusteella ei poista mitään ja palauttaa statuskoodin 204', async () => {
        const nonexistingId = await helper.nonExistingBlogId()

        await api.delete(`/api/blogs/${nonexistingId}`)
            .expect(204)
        
        const blogList = await helper.blogsInDB()
        expect(blogList).toHaveLength(helper.initialBlogs.length + 1) // tässä osiossa 1 blogi lisätty
        
        const blogTitles = blogList.map(b => b.title)
        const uniqueName = blogTitles[0]
        expect(blogTitles.sort()).toEqual([uniqueName].concat(helper.initialBlogs.map(b => b.title)).sort())
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})