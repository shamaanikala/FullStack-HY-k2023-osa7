require('dotenv').config()

//const PORT = 3003
let PORT = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

module.exports = {
    mongoUrl,
    PORT
}