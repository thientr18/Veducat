const mongoose = require('mongoose');
const Student = require('../models/Student');
const ProgressingCourse = require('../models/ProgressingCourse');
const Course = require('../models/Course');
const Announcement = require('../models/Announcement');
const Task = require('../models/Task');
const Material = require('../models/Material');
const Teacher = require('../models/Teacher');
const MaterialFile = require('../models/MaterialFile');

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

            /// Current course
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

            res.render('student/course_homework', { user, student, pCourse});
        } catch {
            console.error(error);
            res.status(500).send({ message: "An error occurred", error });
        }
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

module.exports = new StudentController();

