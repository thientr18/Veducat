const express = require('express');
const adminController = require('../app/controllers/AdminController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const router = express.Router()

router.get('/manage_student/list', adminController.admin_edit_student_get);
router.get('/manage_student/delete/:id', adminController.admin_edit_student_delete);
router.put('/manage_student/edit/:id', adminController.admin_edit_student_put);
router.get('/manage_student/insert', adminController.admin_insert_student_get);
router.post('/manage_student/insert', adminController.admin_insert_student_post);
router.get('/', adminController.admin_get);

module.exports = router;