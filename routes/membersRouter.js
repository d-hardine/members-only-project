const { Router } = require('express')
const membersController = require('../controllers/membersController');
const membersRouter = Router()

membersRouter.get('/', membersController.indexGet)
membersRouter.get('/register', membersController.registerGet)
membersRouter.post('/register', membersController.registerPost)
membersRouter.get('/login', membersController.loginGet)
membersRouter.post('/login', membersController.loginPost)
membersRouter.get('/logout', membersController.logoutGet)

module.exports = membersRouter