const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const ProgressingCourse = require('../models/ProgressingCourse');
const Announcement = require('../models/Announcement');

class TeacherController {
    // View announcements
    async announcement_send_get (req, res, next) {
        const { course_id } = req.params;
        try {
            const course = await ProgressingCourse.findOne({ _id: course_id });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            const announcements = await Announcement.find({ course_id });
            res.render('announcement/toCourse/sendToCourse', { course, announcements });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create announcement
    async announcement_post (req, res, next) {
        const { course_id } = req.params;
        console.log(req.params);
        console.log(course_id)
        const { title, content, recipents, sender } = req.body;
        const type = 'course_announcement';
        console.log(course_id, title, content, recipents, sender, type);
        try {
            await Announcement.create({ courseID: course_id, title, content, recipents, sender, type });
            res.status(201).json({ message: "Announcement created" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // List announcements in a course
    async announcement_list_post (req, res, next) {
        const { courseID } = req.params;
        try {
            const course = await Course.findOne({ courseID });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            // List announcements
            const announcements = await Announcement.find({ courseID });
            res.render('announcement/toCourse/listAnnouncement', { course, announcements });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete announcement
    async announcement_delete_post (req, res, next) {
        const { courseID, announcementID } = req.params;
        try {
            const course = await Course.findOne({ courseID });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            // Delete announcement
            await Announcement.delete({ announcementID });
            res.redirect(`/teacher/course/${courseID}/announcement`);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new TeacherController();