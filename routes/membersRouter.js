const { Router } = require('express')
const membersController = require('../controllers/membersController');
const membersRouter = Router()

membersRouter.get('/', membersController.indexGet)
membersRouter.get('/register', membersController.registerGet)
membersRouter.post('/register', membersController.registerPost, membersController.loginPost) //auto login after create an account
membersRouter.get('/login', membersController.loginGet)
membersRouter.post('/login', membersController.loginPost)
membersRouter.get('/logout', membersController.logoutGet)
membersRouter.get('/new-message', membersController.newMessageGet)
membersRouter.post('/new-message', membersController.newMessagePost)
membersRouter.post('/delete', membersController.deleteMessagePost)

module.exports = membersRouter