const express = require('express');
const teacherController = require('../app/controllers/TeacherController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { checkUser } = require('../app/middlewares/authN');
const router = express.Router()

router.use(checkUser);

// GET /teacher
router.get('/course/:_id/announcement', requireAuthZ('teacher'), teacherController.announcement_get);
router.get('/course/:_id/material', requireAuthZ('teacher'), teacherController.material_get);
router.post('/course/:_id/material', requireAuthZ('teacher'), teacherController.material_post);
router.get('/course/:_id/contact', requireAuthZ('teacher'), teacherController.contact_get);
router.get('/course/:_id/homework', requireAuthZ('teacher'), teacherController.homework_get);
router.get('/course/:_id/discussion', requireAuthZ('teacher'), teacherController.discussion_get);
router.get('/course/:_id/', requireAuthZ('teacher'), teacherController.course_get);
router.get('/', requireAuthZ('teacher'), teacherController.index_get);

module.exports = router;