const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../db/queries')
const fns = require('date-fns')
const { body, validationResult } = require('express-validator')

const indexGet = async (req, res) => {
    const allMessages = await db.getAllMessages()
    let distancedTimeStamps = []
    for(let i = 0; i < allMessages.length; i++) {
        distancedTimeStamps[i] = fns.formatDistance(allMessages[i].timestamp, new Date(), {addSuffix: true})
        allMessages[i].distancedTimeStamp = distancedTimeStamps[i]
    }
    res.render('index', {user: req.user, messages: allMessages})
}

const registerGet = (req, res) => {
    if(req.isAuthenticated())
        res.redirect('/')
    else
        res.render('register')
}

const validateUser = [
    body('firstname').trim()
        .isAlpha().withMessage(`First name must only contain letters.`)
        .isLength({min: 3, max: 15}).withMessage(`First name must be between 3 and 15 characters.`),
    body('lastname').trim()
        .isAlpha().withMessage(`Last name must only contain letters.`)
        .isLength({min: 3, max: 15}).withMessage(`Last name must be between 3 and 15 characters.`),
    body('username').trim()
        .isLength({min: 3, max: 15}).withMessage(`Username must be between 3 and 15 characters.`)
        .custom(async (value) => {
            const duplicateUsername = await db.duplicateUsernameSearch(value)
            if(duplicateUsername) {
                throw new Error('Username has been used, pick another one.')
            }
        }),
    body('password').isStrongPassword({ //it needs at least 5 conditions written to make it work, which is stupid
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0
    }).withMessage(`Password must be at least 8 characters, with numbers and letters.`),
    body('confirmPassword').custom((confirmedPasswordvalue, {req}) => {
        return confirmedPasswordvalue === req.body.password
    }).withMessage("Password and confirm password doesn't match.")
]

const registerPost = [validateUser, async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const { firstname, lastname, username } = req.body
            return res.status(400).render("register", {firstname: firstname, lastname:lastname, username:username, errors: errors.array()})
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            await db.registerNewUser(req.body.firstname, req.body.lastname, req.body.username, hashedPassword, false)
            next()
        }
    } catch(err) {
        console.error(err)
        return next(err)
    }
}]

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

const deleteMessagePost = async (req, res) => {
    await db.deleteMessage(req.body.messageId)
    res.redirect('/')
}

const adminGet = (req, res) => {
    if(req.isAuthenticated() && !req.user.isadmin)
        res.render('admin')
    else if(req.isAuthenticated() && req.user.isadmin)
        res.status(401).send('<b>you are already an administrator</b>')        
    else
        res.status(401).send('<b>you are not authenticated</b>')
}

const validateAdmin = [
    body('passcode').custom((passcodeValue, {req}) => {
        return passcodeValue === 'Bangkok'
    }).withMessage("Wrong passcode. Hint: Capital of Thailand.")
]


const adminPost = [validateAdmin, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).render("admin", {errors: errors.array()})
    } else {
        await db.elevateToAdmin(req.user.id)
        res.redirect('/')
    }
}]

module.exports = { indexGet,
    registerGet,
    registerPost,
    loginGet,
    loginPost,
    logoutGet,
    newMessageGet,
    newMessagePost,
    deleteMessagePost,
    adminGet,
    adminPost
}