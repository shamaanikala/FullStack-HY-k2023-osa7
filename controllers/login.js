const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    

    // voiko tämän siirtää virheidenkäsittely middlewarelle?
    // onko siinä järkeä?
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200)
        .send({ token, username: user.username, name: user.name })
})

// oma funktio T5.2
loginRouter.post('/verify-token', userExtractor, async (request, response) => {
    const verifiedUser = request.user
    if (verifiedUser) {
        response.status(200).send({ verifiedUser })
    }
})

module.exports = loginRouter