const { Router } = require('express')
const membersController = require('../controllers/membersController');
const membersRouter = Router()

membersRouter.get('/', membersController.indexGet)

module.exports = membersRouter