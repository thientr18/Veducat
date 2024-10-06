const express = require('express')
const siteController = require('../app/controllers/SiteController')

const router = express.Router()

router.get('/signup', siteController.signup_get);
router.get('/login', siteController.login_get);
router.get('/', siteController.home_get);

module.exports = router;