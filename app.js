require('dotenv').config()
const express = require('express')
const app = express()
const expressSession = require('express-session')
const socketio = require("./modules/socketio")
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fs = require('fs')
const hbs = require('express-handlebars')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
var server = require('http').Server(app);

const User = require('./models/users')

// define environment variables
const {
    PORT,
    SESSION_SECRET,
    DB_PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} = process.env

const session = expressSession({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
})

//connect to MongoDB
mongoose.connect(
    `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, 
    { authSource: 'admin' }
).then(() => {
    console.log('MongoDB Connected…')
}).catch(err => {
    console.log(err)
    process.exit(1) //exit on database connection error
})

// establish socket io 
socketio(server, session)

// express app setup
// cookies, parsers, passport, view engin
app.use(session)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.engine('handlebars', hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//Define routes
app.use(require('./routes/index'))
app.use(require('./routes/pages'))
app.use(require('./routes/users'))
app.use(require('./routes/download'))
app.use(require('./routes/deleteFile'))

// Serve static files
app.use('/public', express.static('public'))

app.get('/ping', (req, res) => res.send('pong'))
app.post('/ping', (req, res) => res.send('pong'))

//listen on port 3000
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`)
})

module.exports = app //for testing
