const express = require('express');
const adminController = require('../app/controllers/AdminController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { checkUser } = require('../app/middlewares/authN');
const router = express.Router()

router.use(checkUser);

// Manage Student
router.get('/manage_student/insert', requireAuthZ('admin'), adminController.admin_insert_student_get);
router.post('/manage_student/insert', requireAuthZ('admin'), adminController.admin_insert_student_post);
router.get('/manage_student/list', requireAuthZ('admin'), adminController.admin_edit_student_get);
router.put('/manage_student/edit/:id', requireAuthZ('admin'), adminController.admin_edit_student_put);
router.delete('/manage_student/delete/:id', requireAuthZ('admin'), adminController.admin_edit_student_delete);

// Manage Teacher
router.get('/manage_teacher/insert', requireAuthZ('admin'), adminController.admin_insert_teacher_get);
router.post('/manage_teacher/insert', requireAuthZ('admin'), adminController.admin_insert_teacher_post);
router.get('/manage_teacher/list', requireAuthZ('admin'), adminController.admin_edit_teacher_get);
router.put('/manage_teacher/edit/:id', requireAuthZ('admin'), adminController.admin_edit_teacher_put);
router.delete('/manage_teacher/delete/:id', requireAuthZ('admin'), adminController.admin_edit_teacher_delete);

// Manage Course
router.get('/manage_course/insert', requireAuthZ('admin'), adminController.admin_insert_course_get);
router.post('/manage_course/insert', requireAuthZ('admin'), adminController.admin_insert_course_post);
router.get('/manage_course/list', requireAuthZ('admin'), adminController.admin_edit_course_get);
router.put('/manage_course/edit/:id', requireAuthZ('admin'), adminController.admin_edit_course_put);
router.delete('/manage_course/delete/:id', requireAuthZ('admin'), adminController.admin_edit_course_delete);

// Manage Progressing Course
router.get('/manage_progressing_course/insert', requireAuthZ('admin'), adminController.admin_insert_progressing_course_get);
router.post('/manage_progressing_course/insert', requireAuthZ('admin'), adminController.admin_insert_progressing_course_post);
router.get('/manage_progressing_course/list', requireAuthZ('admin'), adminController.admin_edit_progressing_course_get);
router.put('/manage_progressing_course/edit/:id', requireAuthZ('admin'), adminController.admin_edit_progressing_course_put);
router.delete('/manage_progressing_course/delete/:id', requireAuthZ('admin'), adminController.admin_edit_progressing_course_delete);

// Annoucement
router.get('/announcement/send_to_all', requireAuthZ('admin'), adminController.admin_send_to_all_get);
router.post('/announcement/send_to_all', requireAuthZ('admin'), adminController.admin_send_to_all_post);
router.get('/announcement/send_to_all/list', requireAuthZ('admin'), adminController.admin_send_to_all_list);
router.get('/announcement/send_to_all/delete/:id', requireAuthZ('admin'), adminController.admin_send_to_all_delete);
router.get('/announcement/send_to_teacher', requireAuthZ('admin'), adminController.admin_send_to_teacher_get);
router.post('/announcement/send_to_teacher', requireAuthZ('admin'), adminController.admin_send_to_teacher_post);
router.get('/announcement/send_to_teacher/list', requireAuthZ('admin'), adminController.admin_send_to_teacher_list);
router.get('/announcement/send_to_teacher/delete/:id', requireAuthZ('admin'), adminController.admin_send_to_teacher_delete);
router.get('/announcement/send_to_student', requireAuthZ('admin'), adminController.admin_send_to_student_get);
router.post('/announcement/send_to_student', requireAuthZ('admin'), adminController.admin_send_to_student_post);
router.get('/announcement/send_to_student/list', requireAuthZ('admin'), adminController.admin_send_to_student_list);
router.get('/announcement/send_to_student/delete/:id', requireAuthZ('admin'), adminController.admin_send_to_student_delete);

// GET /admin
router.get('/', requireAuthZ('admin'), adminController.admin_get);

module.exports = router;