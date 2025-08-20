const bcrypt = require('bcryptjs')
const passport = require('passport')
const pool = require('../db/pool')
const db = require('../db/queries')
const fns = require('date-fns')

const indexGet = async (req, res) => {
    //console.log('test:' + req.isAuthenticated()) //authentication check
    const allMessages = await db.getAllMessages()
    res.render('index', {user: req.user, messages: allMessages})
}

const registerGet = (req, res) => res.render('register')

const registerPost = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await db.registerNewUser(req.body.firstname, req.body.lastname, req.body.username, hashedPassword, false)
        res.redirect('/')
    } catch(err) {
        console.error(err)
        return next(err)
    }
}

const loginGet = (req, res) => res.render('login')

const loginPost = passport.authenticate('local', {successRedirect:'/', failureRedirect:'/'})

const logoutGet = (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err)
        }
    res.redirect('/')
    })
}

const newMessageGet = (req, res) => {
    if(req.isAuthenticated())
        res.render('newMessage')
    else
        res.status(401).send('<b>you are not authenticated</b>')
}

const newMessagePost = async (req, res) => {
    const { messageTitle, messageContent } = req.body
    const date = new Date()
    await db.postNewMessage(req.user.id, messageTitle, messageContent, date)
    res.redirect('/')
}

module.exports = { indexGet, registerGet, registerPost, loginGet, loginPost, logoutGet, newMessageGet, newMessagePost }