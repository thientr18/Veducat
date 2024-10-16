const express = require('express')
const siteController = require('../app/controllers/SiteController')
const authNController = require('../app/controllers/AuthNController')
const { requireAuth } = require('../app/middlewares/authNMiddleware');
const router = express.Router()

// AuthN
router.get('/signup', authNController.signup_get);
router.post('/signup', authNController.signup_post);
router.get('/login', authNController.login_get);
router.post('/login', authNController.login_post);
router.get('/logout', authNController.logout_get);

// Main
router.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
router.get('/', siteController.home_get);

module.exports = router;