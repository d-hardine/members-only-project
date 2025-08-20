const bcrypt = require('bcryptjs')
const passport = require('passport');
const pool = require('../db/pool')

const indexGet = (req, res) => res.render('index', {user: req.user})

const registerGet = (req, res) => res.render('register')

const registerPost = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await pool.query("INSERT INTO users (firstname, lastname, username, password, admin) VALUES ($1, $2, $3, $4, $5)",
            [req.body.firstname, req.body.lastname, req.body.username, hashedPassword, false]
        )
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

module.exports = { indexGet, registerGet, registerPost, loginGet, loginPost, logoutGet }