const express = require('express');
const studentController = require('../app/controllers/StudentController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { checkUser } = require('../app/middlewares/authN');
const router = express.Router()

// GET /student
router.get('/course/:_id/announcement', checkUser, studentController.announcement_get);
router.get('/course/:_id/material', checkUser, studentController.material_get);
router.get('/course/:_id/contact', checkUser, studentController.contact_get);
router.get('/course/:_id/homework', checkUser, studentController.homework_get);
router.get('/course/:_id/discussion', checkUser, studentController.discussion_get);
router.get('/course/:_id/grade', checkUser, studentController.grade_get);
router.get('/course/:_id/', checkUser, studentController.course_get);
router.get('/', checkUser, studentController.index_get);

module.exports = router;