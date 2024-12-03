const express = require('express');
const adminController = require('../app/controllers/AdminController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { checkUser } = require('../app/middlewares/authN');
const router = express.Router()

// Manage Student
router.get('/manage_student/insert', adminController.admin_insert_student_get);
router.post('/manage_student/insert', adminController.admin_insert_student_post);
router.get('/manage_student/list', adminController.admin_edit_student_get);
router.put('/manage_student/edit/:id', adminController.admin_edit_student_put);
router.get('/manage_student/delete/:id', adminController.admin_edit_student_delete);

// Manage Teacher
router.get('/manage_teacher/insert', adminController.admin_insert_teacher_get);
router.post('/manage_teacher/insert', adminController.admin_insert_teacher_post);
router.get('/manage_teacher/list', adminController.admin_edit_teacher_get);
router.put('/manage_teacher/edit/:id', adminController.admin_edit_teacher_put);
router.get('/manage_teacher/delete/:id', adminController.admin_edit_teacher_delete);

// Manage Course
router.get('/manage_course/insert', adminController.admin_insert_course_get);
router.post('/manage_course/insert', adminController.admin_insert_course_post);
router.get('/manage_course/list', adminController.admin_edit_course_get);
router.put('/manage_course/edit/:id', adminController.admin_edit_course_put);
router.get('/manage_course/delete/:id', adminController.admin_edit_course_delete);

// Manage Progressing Course
router.get('/manage_progressing_course/insert', adminController.admin_insert_progressing_course_get);
router.post('/manage_progressing_course/insert', adminController.admin_insert_progressing_course_post);
router.get('/manage_progressing_course/list', adminController.admin_edit_progressing_course_get);
router.put('/manage_progressing_course/edit/:id', adminController.admin_edit_progressing_course_put);
router.get('/manage_progressing_course/delete/:id', adminController.admin_edit_progressing_course_delete);

// Annoucement
router.get('/announcement/send_to_all', checkUser, adminController.admin_send_to_all_get);
router.post('/announcement/send_to_all', adminController.admin_send_to_all_post);
router.get('/announcement/send_to_all/list', adminController.admin_send_to_all_list);
router.get('/announcement/send_to_all/delete/:id', adminController.admin_send_to_all_delete);
router.get('/announcement/send_to_teacher', checkUser, adminController.admin_send_to_teacher_get);
router.post('/announcement/send_to_teacher', adminController.admin_send_to_teacher_post);
router.get('/announcement/send_to_teacher/list', adminController.admin_send_to_teacher_list);
router.get('/announcement/send_to_teacher/delete/:id', adminController.admin_send_to_teacher_delete);
router.get('/announcement/send_to_student', checkUser, adminController.admin_send_to_student_get);
router.post('/announcement/send_to_student', adminController.admin_send_to_student_post);
router.get('/announcement/send_to_student/list', adminController.admin_send_to_student_list);
router.get('/announcement/send_to_student/delete/:id', adminController.admin_send_to_student_delete);

// GET /admin
router.get('/', adminController.admin_get);

module.exports = router;