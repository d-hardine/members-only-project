const path = require('node:path')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const membersRouter = require('./routes/membersRouter')

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(membersRouter)

app.listen(3000)