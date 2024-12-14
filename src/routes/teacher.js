const express = require('express');
const teacherController = require('../app/controllers/TeacherController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { checkUser } = require('../app/middlewares/authN');
const router = express.Router()
const multer  = require('multer')

router.use(checkUser);

//Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/teacher');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024* 1024 * 1024 * 10 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/zip', 'application/x-rar-compressed'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
})
const cpUpload = upload.fields([{ name: 'file', maxCount: 10 }])

// :/teacher

router.get('/', requireAuthZ('teacher'), teacherController.index_get);
router.get('/profile', requireAuthZ('teacher'), teacherController.profile_get);
router.get('/course/:_id/', requireAuthZ('teacher'), teacherController.course_get);

router.get('/course/:_id/announcement', requireAuthZ('teacher'), teacherController.announcement_get);
router.post('/course/:_id/announcement', requireAuthZ('teacher'), teacherController.announcement_post);
router.get('/announcement/', requireAuthZ('teacher'), teacherController.admin_announcement_get);


router.get('/course/:_id/material', requireAuthZ('teacher'), teacherController.material_get);
router.post('/course/:_id/material', cpUpload, requireAuthZ('teacher'), teacherController.material_post);
router.get('/course/:_id/material/:mID', requireAuthZ('teacher'), teacherController.material_detail_get);
router.get('/course/:_id/material/delete/:_id', requireAuthZ('teacher'), teacherController.teacher_delete_material);
router.put('/course/:_id/material/edit/:_id', cpUpload, requireAuthZ('teacher'), teacherController.teacher_edit_material);

router.get('/course/:_id/contact', requireAuthZ('teacher'), teacherController.contact_get);

router.get('/course/:_id/homework', requireAuthZ('teacher'), teacherController.homework_get);
router.post('/course/:_id/homework', cpUpload, requireAuthZ('teacher'), teacherController.homework_post);
router.get('/homework/task', requireAuthZ('teacher'), teacherController.tasks_get);
router.get('/course/:_id/homework/:hID', requireAuthZ('teacher'), teacherController.homework_detail_get);
router.get('/course/:_id/homework/delete/:_id', requireAuthZ('teacher'), teacherController.teacher_delete_homework);
router.put('/course/:_id/homework/edit/:hID', cpUpload, requireAuthZ('teacher'), teacherController.teacher_edit_homework);

router.get('/course/:_id/discussion', requireAuthZ('teacher'), teacherController.discussion_get);
router.post('/discussion',cpUpload, requireAuthZ('teacher'), teacherController.discussion_post);
router.get('/discussion', requireAuthZ('teacher'), teacherController.discussion_all_get);

router.get('/grade', requireAuthZ('teacher'), teacherController.grade_all_get);
router.get('/course/:_id/grade', requireAuthZ('teacher'), teacherController.grade_get);



module.exports = router;