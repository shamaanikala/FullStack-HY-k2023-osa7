const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('kun tietokannassa on jo yksi käyttäjä', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('salaisuus',10)
        const user = new User({ username: 'testi-root', passwordHash })

        await user.save()
    })

    test('tuo yksi käyttäjä löytyy tietokannasta', async () => {
        const usersInDb = await helper.usersInDb()

        expect(usersInDb).toHaveLength(1)
    })

    test('uuden käyttäjän voi lisätä, kun käyttäjänimi on käyttämätön', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api.post('/api/users').send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('uutta käyttäjää samalla nimellä ei voida luoda ja pyyntö palauttaa koodin 400', async () => {
        
        expect(null).toBe(1)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})