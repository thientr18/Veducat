const express = require('express');
const siteController = require('../app/controllers/SiteController');
const authNController = require('../app/controllers/AuthNController');
const studentController = require('../app/controllers/StudentController');
const { requireAuthN } = require('../app/middlewares/authN');
const { requireAuthZ } = require('../app/middlewares/authZ');
const router = express.Router()

// AuthN
router.get('/signup', authNController.signup_get);
router.post('/signup', authNController.signup_post);
router.get('/login', authNController.login_get);
router.post('/login', authNController.login_post);
router.get('/logout', authNController.logout_get);

// Main
router.get('/smoothies', requireAuthZ(['admin', 'teacher']), (req, res) => res.render('smoothies'));
router.get('/', requireAuthN, siteController.home_get);

module.exports = router;