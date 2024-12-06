const express = require('express');
const teacherController = require('../app/controllers/TeacherController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { checkUser } = require('../app/middlewares/authN');
const router = express.Router()

// Announcements
router.get('/course/:course_id/announcement', requireAuthZ('teacher'), teacherController.announcement_send_get);
router.post('/course/:course_id/announcement', requireAuthZ('teacher'), teacherController.announcement_post);
router.get('/course/:course_id/announcement/list/delete', requireAuthZ('teacher'), teacherController.announcement_list_post);
router.get('/course/:course_id/announcement/:announcementID/delete', requireAuthZ('teacher'), teacherController.announcement_delete_post);

module.exports = router;