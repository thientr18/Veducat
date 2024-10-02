const express = require('express')
const router = express.Router()

const homeController = require('../app/controllers/HomeController')

router.get('/test', homeController.test)
router.get('/', homeController.home)

module.exports = router;