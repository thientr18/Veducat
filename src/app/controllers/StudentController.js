const mongoose = require('mongoose');
const Student = require('../models/Student');
const ProgressingCourse = require('../models/ProgressingCourse');
const Course = require('../models/Course');
const Announcement = require('../models/Announcement');

class StudentController {
    // GET /student
    async index_get(req, res, next) {
        const user = res.locals.user; // Access the user from res.locals
        try {
            const student = await Student.findOne({ studentID: user.userID });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Find ProgressingCourses that include the student's ID in the students array
            const progressingCourses = await ProgressingCourse.find({ students: student.studentID });
            const progressingCourseIDs = progressingCourses.map(course => course.courseID);

            // Find ProgressingCourses that include the student's ID in the students array
            const courses = await Course.find({ courseID: { $in: progressingCourseIDs } });

            const studentCourses = progressingCourses.map(pCourse => {
                // Find the matching course from the Course array
                const course = courses.find(c => c.courseID === pCourse.courseID);
                return {
                    ...pCourse._doc, // Include all existing fields from ProgressingCourse
                    name: course?.name || null, // Add name from Course
                    description: course?.description || null // Add description from Course
                };
            });
            
            // Find announcements sent to the student
            const announcements = await Announcement.find({ recipents: student.studentID });
            console.log(announcements.map(a => a.courseID));
            // Extract unique courseIDs from announcements
            const announcementCourseIDs = [...new Set(announcements.map(a => a.courseID))];

            // Fetch courses corresponding to announcement courseIDs
            const announcementCourses = await Course.find({ courseID: { $in: announcementCourseIDs } });

            // Enrich announcements with courseName
            const enrichedAnnouncements = announcements.map(announcement => {
                const course = announcementCourses.find(c => c.courseID === announcement.courseID);
                return {
                    ...announcement._doc, // Include all fields from Announcement
                    courseName: course?.name || null // Add courseName from Course
                };
            });
            res.render('student/index', { user, student, studentCourses, announcements: enrichedAnnouncements });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

module.exports = new StudentController();

