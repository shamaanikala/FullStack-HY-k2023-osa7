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
})

afterAll(async () => {
    await mongoose.connection.close()
})