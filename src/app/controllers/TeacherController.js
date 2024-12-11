const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const ProgressingCourse = require('../models/ProgressingCourse');
const Announcement = require('../models/Announcement');
const Material = require('../models/Material');
const multer = require('multer');
const Student = require('../models/Student');

class TeacherController {

    // GET /teacher
    async index_get (req, res, next) {
        const user = res.locals.user;

        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            // List progressingCourses
            const progressingCourses = await ProgressingCourse.find({ teacherID: teacher.teacherID });
            if (!progressingCourses.length) {
                return res.render('teacher/index', { user, teacher, teacherCourses: [], announcements: [] });
            }
            const courses = await Course.find({ courseID: { $in: progressingCourses.map(pc => pc.courseID) } });
            const teacherCourses = progressingCourses.map(pCourse => {
                const course = courses.find(c => c.courseID === pCourse.courseID);
                return {
                    ...pCourse._doc,
                    name: course?.name || null,
                    description: course?.description || null
                };
            });

            // List announcements
            const announcements = await Announcement.find({ recipents: teacher.teacherID });
            if (!announcements.length) {
                return res.render('teacher/index', { user, teacher, teacherCourses, announcements: [] });
            }
            const enrichedAnnouncements = announcements.map(announcement => {
                const pCourse = progressingCourses.find(pc => pc._id.toString() === announcement.courseID);
                const course = courses.find(c => c.courseID === pCourse?.courseID);
                return {
                    ...announcement._doc,
                    courseName: course?.name || null,
                    courseDescription: course?.description || null
                };
            });

            res.render('teacher/index', { user, teacher, teacherCourses, announcements: enrichedAnnouncements });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
    }

    // GET /teacher/course/:_id/
    async course_get (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            let progressingCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: progressingCourse.courseID });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            progressingCourse = { ...progressingCourse._doc, courseName: course.name, courseDescription: course.description };

            res.render('teacher/course', { user, teacher, progressingCourse });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // GET /teacher/course/:_id/announcement
    async announcement_get (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            let progressingCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: progressingCourse.courseID });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            progressingCourse = { ...progressingCourse._doc, courseName: course.name, courseDescription: course.description };

            const announcements = await Announcement.find({ courseID: progressingCourse._id });

            res.render('teacher/course_announcement', { user, teacher, progressingCourse, announcements });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // POST /teacher/course/:_id/announcement
    async announcement_post (req, res, next) {
        const user = res.locals.user;
        const { courseID, title, content, sender, recipents, type } = req.body;
        try {
            await Announcement.create({ courseID, title, content, sender, recipents, type });
            res.status(201).json({ message: "Announcement created successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // GET /teacher/course/:_id/material
    async material_get (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            let progressingCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: progressingCourse.courseID });
            progressingCourse = { ...progressingCourse._doc, courseName: course.name, courseDescription: course.description };

            const materials = await Material.find({ courseID: progressingCourse._id });

            res.render('teacher/course_material', { user, teacher, progressingCourse, materials });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async material_detail_get (req, res, next) {
        const user = res.locals.user;
        const { _id, mID } = req.params;
        console.log(_id, mID);
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            
            let progressingCourse = await ProgressingCourse.findById(_id);
            const course = await Course.findOne({ courseID: progressingCourse.courseID });
            progressingCourse = { ...progressingCourse._doc, courseName: course.name, courseDescription: course.description };

            const material = await Material.findById({ _id: mID });

            res.render('teacher/course_material_display', { user, teacher, progressingCourse, material });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // POST /teacher/course/:_id/material
    async material_post (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        const {courseID, title, description} = req.body;
        const files = req.files;

        upload(req, res, async (err) => {

            // if (err) {
            //     console.log('Hello 0');
            //     return res.status(400).json({ hello: 'hello', message: err.message });
            // } 

            try {
                const teacher = await Teacher.findOne({ teacherID: user.userID });
                if (!teacher) {
                    return res.status(404).json({ message: "Teacher not found" });
                }

                let progressingCourse = await ProgressingCourse.findById(_id);
                const course = await Course.findOne({ courseID: progressingCourse.courseID });

                if(files.file == null){
                    await Material.create({courseID : courseID,
                        title : title,
                        description : description,
                        uploadedBy: teacher.teacherID,
                    });
                } else{
                    const materials = files.file.map(file => ({
                        courseID,
                        title,
                        description,
                        filePath: file.path,
                        fileType: file.mimetype,
                        fileSize: file.size,
                        uploadedBy: teacher.teacherID,
                    }));
                    await Material.create(materials);
                }                
                // await Material.insertMany(materials);
                res.status(201).json({ message: "Material uploaded successfully" });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }

    // GET /teacher/course/:_id/contact
    async contact_get (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            let progressingCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: progressingCourse.courseID });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            progressingCourse = { ...progressingCourse._doc, courseName: course.name, courseDescription: course.description };
            
            
            const students = await Student.find({ studentID: { $in: progressingCourse.students } });

            res.render('teacher/course_contact', { user, teacher, progressingCourse, students });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // GET /teacher/course/:_id/homework
    async homework_get (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            let progressingCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: progressingCourse.courseID });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            progressingCourse = { ...progressingCourse._doc, courseName: course.name, courseDescription: course.description };

            res.render('teacher/course_homework', { user, teacher, progressingCourse });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // GET /teacher/course/:_id/discussion
    async discussion_get (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            let progressingCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: progressingCourse.courseID });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            progressingCourse = { ...progressingCourse._doc, courseName: course.name, courseDescription: course.description };

            res.render('teacher/course_discussion', { user, teacher, progressingCourse });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // GET /teacher/course/:_id/grade
    async grade_get (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            let progressingCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: progressingCourse.courseID });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            progressingCourse = { ...progressingCourse._doc, courseName: course.name, courseDescription: course.description };

            res.render('teacher/course_grade', { user, teacher, progressingCourse });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    // GET /teacher/announcement
    async admin_announcement_get (req, res, next) {
        const user = res.locals.user;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            const announcements = await Announcement.find({ recipents: teacher.teacherID });

            res.render('teacher/admin_announcement', { user, teacher, announcements});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async profile_get (req, res, next) {
        const user = res.locals.user;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            res.render('teacher/profile', { user, teacher });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async tasks_get (req, res, next) {
        const user = res.locals.user;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            const progressingCourses = await ProgressingCourse.find({ teacherID: teacher.teacherID });
            if (!progressingCourses.length) {
                return res.render('teacher/index', { user, teacher, teacherCourses: [], announcements: [] });
            }
            const courses = await Course.find({ courseID: { $in: progressingCourses.map(pc => pc.courseID) } });
            const teacherCourses = progressingCourses.map(pCourse => {
                const course = courses.find(c => c.courseID === pCourse.courseID);
                return {
                    ...pCourse._doc,
                    name: course?.name || null,
                    description: course?.description || null
                };
            });

            res.render('teacher/task', { user, teacher, teacherCourses });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async discussion_all_get (req, res, next) {
        const user = res.locals.user;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            const progressingCourses = await ProgressingCourse.find({ teacherID: teacher.teacherID });
            if (!progressingCourses.length) {
                return res.render('teacher/index', { user, teacher, teacherCourses: [], announcements: [] });
            }
            const courses = await Course.find({ courseID: { $in: progressingCourses.map(pc => pc.courseID) } });
            const teacherCourses = progressingCourses.map(pCourse => {
                const course = courses.find(c => c.courseID === pCourse.courseID);
                return {
                    ...pCourse._doc,
                    name: course?.name || null,
                    description: course?.description || null
                };
            });

            res.render('teacher/discussion', { user, teacher, teacherCourses });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async grade_all_get (req, res, next) {
        const user = res.locals.user;
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            res.render('teacher/grade', { user, teacher });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage');
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

module.exports = new TeacherController();