const express = require('express');

const studentController = require('../app/controllers/StudentController');
const teacherController = require('../app/controllers/TeacherController');
const adminController = require('../app/controllers/AdminController');

const router = express.Router()

// /course/
router.get('/', (req, res) => {
    const role = res.locals.user.role;
    switch (role) {
        case 'student':
            studentController.course_get(req, res);
            break;
        case 'teacher':
            res.json({ message: 'You are a teacher' });
            break;
        default:
            res.json({ message: 'No permission' });
            break;
    }
});

module.exports = router;