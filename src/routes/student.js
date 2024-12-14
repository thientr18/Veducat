const express = require('express');
const studentController = require('../app/controllers/StudentController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { checkUser } = require('../app/middlewares/authN');
const router = express.Router()
const multer  = require('multer')

router.use(checkUser);

//Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/student');
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


// GET /student

router.get('/course/:_id/', requireAuthZ('student'), studentController.course_get);
router.get('/homework/task', requireAuthZ('student'), studentController.task_get);
router.get('/', requireAuthZ('student'), studentController.index_get);
router.get('/profile', requireAuthZ('student'), studentController.profile_get);
router.get('/course/:_id/contact', requireAuthZ('student'), studentController.contact_get);

router.get('/course/:_id/announcement', requireAuthZ('student'), studentController.announcement_get);
router.get('/announcement', requireAuthZ('student'), studentController.announcement_all_get);

router.get('/course/:_id/material', requireAuthZ('student'), studentController.material_get);
router.get('/course/:_id/material/:mID', requireAuthZ('student'), studentController.material_detail_get);

router.get('/course/:_id/homework/:hID', requireAuthZ('student'), studentController.homework_detail_get);
router.get('/course/:_id/homework/:hID/submission', requireAuthZ('student'), studentController.homework_submission_get);
router.get('/course/:_id/homework', requireAuthZ('student'), studentController.homework_get);
router.post('/course/:_id/homework/:hID', cpUpload, requireAuthZ('student'), studentController.homework_submit_post);


router.get('/course/:_id/discussion', requireAuthZ('student'), studentController.discussion_get);
router.get('/discussion', requireAuthZ('student'), studentController.discussion_all_get);

router.get('/grade', requireAuthZ('student'), studentController.grade_all_get);
router.get('/course/:_id/grade', requireAuthZ('student'), studentController.grade_get);

module.exports = router;