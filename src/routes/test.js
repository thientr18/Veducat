const express = require('express')
const router = express.Router()
const testController = require('../app/controllers/TestController')

router.get('/sub', testController.subTest)
router.get('/', testController.test)

module.exports = router;