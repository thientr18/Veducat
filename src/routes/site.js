const express = require('express');
const authNController = require('../app/controllers/AuthNController');
const router = express.Router();

// AuthN
router.get('/login', authNController.login_get);
router.post('/login', authNController.login_post);
router.get('/logout', authNController.logout_get);

// Redirect user to the corresponding page
router.get('/', (req, res) => {
    const user = res.locals.user;
    if (!user) {
        return res.render('login');
    }
    const { role } = user;
    switch (role) {
        case 'student':
            res.redirect('/student');
            break;
        case 'teacher':
            res.redirect('/teacher');
            break;
        case 'admin':
            res.redirect('/admin');
            break;
        default:
            res.json({ message: 'No permission' });
            break;
    }
});

module.exports = router;