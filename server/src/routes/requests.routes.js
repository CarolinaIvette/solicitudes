const router = require('express').Router()
const { isAuthenticated } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { createRequestSchema, updateRequestSchema } = require('../schemas/requests.schema')
const { getAll, getById, create, update, remove } = require('../controllers/requests.controller')

router.use(isAuthenticated)

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', isAuthenticated, validate(createRequestSchema), create)
router.put('/:id', isAuthenticated, validate(updateRequestSchema), update)
router.delete('/:id', remove)

module.exports = router

