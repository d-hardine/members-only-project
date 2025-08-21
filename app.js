const path = require('node:path')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const membersRouter = require('./routes/membersRouter')
const pool = require('./db/pool')

const pgSession = require('connect-pg-simple')(session)

const app = express()
//app.set('views', path.join(__dirname, 'views')) might be unnecessary
app.set('view engine', 'ejs')
const assetsPath = path.join(__dirname, "public"); //needed to connect css
app.use(express.static(assetsPath)); //needed to connect css
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const sessionStore = new pgSession({
    pool: pool,
    createTableIfMissing: true
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 /*1 sec*/ * 60 /*1 minute*/ * 60 /*1 hour*/ * 24 //equals 1 day
    }
}))

app.use(passport.session())

app.use(membersRouter)

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

app.listen(3000, (error) => {
    if(error)
        throw error

    console.log('app listening on post 3000!')
})