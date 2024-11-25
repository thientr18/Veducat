const express = require('express');
const siteController = require('../app/controllers/SiteController');
const authNController = require('../app/controllers/AuthNController');
// const studentController = require('../app/controllers/StudentController');
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
router.get('/home', requireAuthN, siteController.home_get);

// /course/
router.get('/', requireAuthN, (req, res) => {
    const role = res.locals.user.role;
    switch (role) {
        // case 'student':
        //     res.redirect('/student');
        //     break;
        // case 'teacher':
        //     res.redirect('/teacher');
        //     break;
        case 'admin':
            res.redirect('/admin');
            break;
        default:
            res.json({ message: 'No permission' });
            break;
    }
});

module.exports = router;