const mongoose = require('mongoose');
const Student = require('../models/Student');
const ProgressingCourse = require('../models/ProgressingCourse');
const Course = require('../models/Course');
const Announcement = require('../models/Announcement');
const Teacher = require('../models/Teacher');
const Task = require('../models/Task');
const TaskFile = require('../models/TaskFile');
const Material = require('../models/Material');
const MaterialFile = require('../models/MaterialFile');
const SubmissionFiles = require('../models/SubmissionFiles');
const Submission = require('../models/Submission');
const TaskforStudent = require('../models/TaskforStudent');

const multer = require('multer');


class StudentController {
    // GET /student
    async index_get(req, res, next) {
        const user = res.locals.user; // Access the user from res.locals
        try {
            // Find the student based on the logged-in user's ID
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            const pCourses = await ProgressingCourse.find({ students: student.studentID });
            if (!pCourses.length) {
                return res.render('student/index', { user, student, studentCourses: [], announcements: [] });
            }
            const courses = await Course.find({ courseID: { $in: pCourses.map(c => c.courseID) } });
            const studentCourses = pCourses.map(pCourse => {
                const course = courses.find(c => c.courseID === pCourse.courseID);
                return {
                    ...pCourse._doc,
                    name: course?.name || null,
                    description: course?.description || null
                };
            });

            const announcements = await Announcement.find({ receivers: student.studentID });
            if (!announcements.length) {
                return res.render('student/index', { user, student, studentCourses, announcements: [] });
            }

            const enrichedAnnouncements = announcements.map(announcement => {
                const pCourse = pCourses.find(pc => pc._id.toString() === announcement.pCourseID);
                const course = courses.find(c => c.courseID === pCourse?.courseID);
                return {
                    ...announcement._doc,
                    courseName: course?.name || null,
                    courseDescription: course?.description || null
                };
            });

            res.render('student/index', { user, student, studentCourses, announcements: enrichedAnnouncements });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }

    // GET /student/course/:_id
    async course_get(req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Current course
            let pCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            res.render('student/course', { user, student, pCourse });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }

    async announcement_get(req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Current course
            let pCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const announcements = await Announcement.find({ pCourseID: pCourse._id, receivers: student.studentID });

            res.render('student/course_announcement', { user, student, pCourse, announcements});
        } catch {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }

    async material_get(req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Current course
            let pCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const materials = await Material.find({ courseID: pCourse._id });

            res.render('student/course_material', { user, student, pCourse, materials });
        } catch {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }

    async material_detail_get(req, res, next) {
        const user = res.locals.user;
        const { _id, mID } = req.params;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            /// Current course
            let pCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const material = await Material.findOne({ _id: mID });
            const materialFiles = await MaterialFile.find({ materialID: material._id });

            res.render('student/course_material_display', { user, student, pCourse, material, materialFiles});
        } catch {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }

    async contact_get(req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            /// Current course
            let pCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const teacher = await Teacher.findOne({ teacherID: pCourse.teacherID });

            res.render('student/course_contact', { user, student, pCourse, teacher});
        } catch {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }

    async homework_get(req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            /// Current course
            let pCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const homeworks = await Task.find({pCourseID: pCourse._id})

            res.render('student/course_homework', { user, student, pCourse, homeworks});
        } catch {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }
    async homework_detail_get(req, res, next) {
        const user = res.locals.user;
        const { _id, hID } = req.params;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            /// Current course
            let pCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const homework = await Task.findOne({ _id: hID });
            const homeworkFiles = await TaskFile.find({ taskID: homework._id });

            res.render('student/course_homework_display', { user, student, pCourse, homework,homeworkFiles});
        } catch {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }
    async homework_submit_post(req, res, next) {
        const user = res.locals.user;
        const { _id , hID } = req.params;
        const {description} = req.body;
        const files = req.files;

        upload(req, res, async (err) => {

            try {
                const student = await Student.findOne({ studentID: user.userID });
                if (!student) {
                    return res.status(404).json({ message: "Student not found" });
                }
                const homework = await Task.findOne({ _id: hID });
                if(files.file == null){
                    await Submission.create({
                        taskID : hID,
                        taskName: homework.title,
                        studentID : student.studentID,
                        description : description,
                    });
                    await TaskforStudent.updateOne({taskID: hID, studentID: student.studentID}, {status: 'Submitted'});

                } else{
                    const submission = await Submission.create({
                        taskID : hID,
                        taskName: homework.title,
                        studentID : student.studentID,
                        description : description,
                    });
                    await TaskforStudent.updateOne({taskID: hID, studentID: student.studentID}, {status: 'Submitted'});

                    const uploadFiles = files.file.map(file => ({
                        submissionID: submission._id,
                        fileName: file.originalname,
                        filePath: file.path,
                        fileType: file.mimetype,
                        fileSize: file.size,
                    }));
                    console.log(uploadFiles);
                    await SubmissionFiles.create(uploadFiles);
                }                
                res.status(201).json({ message: "Homework submitted" });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }


    async discussion_get(req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            /// Current course
            let pCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            res.render('student/course_discussion', { user, student, pCourse});
        } catch {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }

    async grade_get(req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            /// Current course
            let pCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            res.render('student/course_grade', { user, student, pCourse});
        } catch {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }

    async task_get(req, res, next) {
        const user = res.locals.user;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.render('student/task', { user, student});
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }
    async profile_get(req, res, next) {
        const user = res.locals.user;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.render('student/profile', { user, student });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }
    async announcement_all_get(req, res, next) {
        const user = res.locals.user;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            const announcements = await Announcement.find({ receivers: student.studentID });

            res.render('student/announcement', { user, student, announcements});
        } 
        catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }
    async discussion_all_get(req, res, next) {
        const user = res.locals.user;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.render('student/discussion', { user, student});
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }
    async grade_all_get(req, res, next) {
        const user = res.locals.user;
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.render('student/grade', { user, student});
        } 
        catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/student');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024*1024 * 1024 * 10 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/zip', 'application/x-rar-compressed'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
}).array('files', 10);

module.exports = new StudentController();

