const express = require('express');
const studentController = require('../app/controllers/StudentController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const router = express.Router()

// GET /student
router.get('/course/:_id/announcement', requireAuthZ('student'), studentController.announcement_get);
router.get('/course/:_id/material', requireAuthZ('student'), studentController.material_get);
router.get('/course/:_id/contact', requireAuthZ('student'), studentController.contact_get);
router.get('/course/:_id/homework', requireAuthZ('student'), studentController.homework_get);
router.get('/course/:_id/discussion', requireAuthZ('student'), studentController.discussion_get);
router.get('/course/:_id/grade', requireAuthZ('student'), studentController.grade_get);
router.get('/course/:_id/', requireAuthZ('student'), studentController.course_get);
router.get('/', requireAuthZ('student'), studentController.index_get);

module.exports = router;