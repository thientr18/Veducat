const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const ProgressingCourse = require('../models/ProgressingCourse');
const Announcement = require('../models/Announcement');

class AdminController {

    admin_get(req, res) {
        res.json('admin');
    }

    admin_post(req, res) {
        res.json('admin');
    }

    /*--- START manage STUDENT---*/ 
    // GET /admin/manage_student/insert
    admin_insert_student_get(req, res, next) {
        res.render('admin/manage_student/insertStudent');
        next();
    }

    // POST /admin/manage_student/insert
    async admin_insert_student_post(req, res) {
        const {studentID, name, DoB, email} = req.body;
        console.log(studentID, name, DoB, email)
        try {
            await User.create({ userID: studentID})
            await Student.create({ studentID: studentID,
                                    name: name, 
                                    DoB: DoB, 
                                    email: email })
            console.log('Insert student successfully')
            res.status(200).json( { message: 'Insert student successfully' })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // GET /admin/manage_student/list
    async admin_edit_student_get(req, res) {
        try {
            const students = await Student.find();
            res.render('admin/manage_student/editStudent', { students });
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // PUT /admin/manage_student/list
    async admin_edit_student_put(req, res) {
        const { studentID, name, DoB, email } = req.body;
        try {
            await Student.updateOne({ studentID: studentID }, {studentID: studentID, name: name, DoB: DoB, email: email })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /manage_student/delete/:id
    async admin_edit_student_delete(req, res) {
        const studentID = req.params.id;
        try {
            await Student.deleteOne({ studentID: studentID })
            await User.deleteOne({ userID: studentID })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }
    /*--- End manage studen ---*/ 

    /*--- START manage teacher---*/ 
    // GET /admin/manage_teacher/insert
    admin_insert_teacher_get(req, res) {
        res.render('admin/manage_teacher/insertTeacher');
    }

    // POST /admin/manage_teacher/insert
    async admin_insert_teacher_post(req, res) {
        const {teacherID, name, DoB, email} = req.body;
        try {
            await User.create({ userID: teacherID, role: 'teacher' })
            await Teacher.create({teacherID: teacherID,
                                    name: name,
                                    DoB: DoB,
                                    email: email})
            console.log('Insert teacher successfully')
            res.status(201).json( { message: 'Insert teacher successfully' })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // GET /admin/manage_teacher/list
    async admin_edit_teacher_get(req, res) {
        try {
            const teachers = await Teacher.find();
            res.render('admin/manage_teacher/editTeacher', { teachers });
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // PUT /admin/manage_teacher/list
    async admin_edit_teacher_put(req, res) {
        const { teacherID, name, email } = req.body;
        try {
            await Teacher.updateOne({ teacherID: teacherID }, {teacherID: teacherID, name: name, email: email })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /manage_teacher/delete/:id
    async admin_edit_teacher_delete(req, res) {
        const teacherID = req.params.id;
        try {
            await Teacher.deleteOne({ teacherID: teacherID })
            await User.deleteOne({ userID: teacherID })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }
    /*--- END manage teacher---*/ 

    /*--- START manage COURSE---*/     
    // GET /admin/manage_course/insert
    admin_insert_course_get(req, res) {
        res.render('admin/manage_course/insertCourse');
    }

    // POST /admin/manage_course/insert
    async admin_insert_course_post(req, res) {
        const { courseID, name, description, createdAt } = req.body;
        try {
            await Course.create({courseID: courseID,
                                name: name,
                                description: description,
                                createdAt: createdAt})
            console.log('Insert course successfully')
        }
        catch (err) {
            res.status(400).json( {err: err,
                message: 'Insert course failed'
            } )
        }
    }

    // GET /admin/manage_course/list
    async admin_edit_course_get(req, res) {
        try {
            const courses = await Course.find();
            res.render('admin/manage_course/editCourse', { courses });
        }
        catch (err) {
            res.status(400).json( {err,
                courseID: courseID,
                message: 'Get course failed'
} )
        }
    }

    // PUT /admin/manage_course/list
    async admin_edit_course_put(req, res) {
        const { courseID, name, teacherID } = req.body;
        try {
            await Course.updateOne({ courseID: courseID }, {courseID: courseID, name: name, teacherID: teacherID })
        }
        catch (err) {
            res.status(400).json( { err: err,
                                    courseID: courseID,
                                    name: name,
                                    teacherID: teacherID,
                                    message: 'Update course failed'
            } )
        }
    }

    // /manage_course/delete/:id
    async admin_edit_course_delete(req, res) {
        const courseID = req.params.id;
        try {
            await Course.deleteOne({ courseID: courseID })
        }
        catch (err) {
            res.status(400).json( {err: err,
                                    courseID: courseID,
                                    message: 'Delete course failed'
            } )
        }
    }
    /*--- END manage COURSE---*/ 

    /* START PROGRESSING COURSE */
    // GET /admin/manage_course/progressing
    async admin_insert_progressing_course_get(req, res) {
        try {
            const courses = await Course.find();
            const teachers = await Teacher.find();
            const students = await Student.find();
            res.render('admin/manage_progressing_course/insertProgressingCourse', { courses, teachers, students });
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // POST /admin/manage_course/progressing
    async admin_insert_progressing_course_post(req, res) {
        const { courseID, teacherID, studentIDs } = req.body;

        // Validate required fields
        if (!courseID || !teacherID || !Array.isArray(studentIDs) || studentIDs.length === 0) {
            return res.status(400).json({ error: 'Invalid input: courseID, teacherID, and studentIDs are required.' });
        }
        
        try {
            await ProgressingCourse.create({
                courseID: courseID.toLowerCase(),
                teacherID: teacherID.toLowerCase(),
                students: studentIDs.map(studentID => studentID.toLowerCase()),
            });
        }
        catch (err) {
            console.log(courseID, teacherID, studentIDs, 'Insert progressing course failed', err);
            res.status(400).json( { message: 'Insert progressing course failed' })
        }
    }

    // GET /admin//manage_progressing_course/list
    async admin_edit_progressing_course_get(req, res) {
        try {
            const progressingCourses = await ProgressingCourse.find();
            const students = await Student.find();
            const studentIDs = students.map(student => student.studentID); // Create an array of student IDs

            res.render('admin/manage_progressing_course/editProgressingCourse', { progressingCourses, studentIDs });
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // PUT /admin/manage_progressing_course/list
    async admin_edit_progressing_course_put(req, res) {
        const { courseID, teacherID, studentIDs } = req.body;
        const progressingCourseID = req.params.id;
        try {
            await ProgressingCourse.updateOne({ _id: progressingCourseID }, { courseID: courseID, teacherID: teacherID, students: studentIDs })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /manage_progressing_course/delete/:id
    async admin_edit_progressing_course_delete(req, res) {
        const progressingCourseID = req.params.id;

        console.log('progressingCourseID: ', progressingCourseID)
        try {
            await ProgressingCourse.deleteOne({ _id: progressingCourseID })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }
    /* END PROGRESSING COURSE */

    /* START ANNOUNCEMENT */
    // GET /admin/announcement/send_to_all
    async admin_send_to_all_get(req, res) {
        const students = await Student.find();
        const studentIDs = students.map(personID => personID.studentID); // Create an array of student IDs
        const teachers = await Teacher.find();
        const teacherIDs = teachers.map(personID => personID.teacherID); // Create an array of teacher IDs
        const allPeople = [...studentIDs, ...teacherIDs];

        res.render('announcement/toAll/sendToAll', { allPeople });
    }

    // POST /admin/announcement/send_to_all
    async admin_send_to_all_post(req, res) {
        const { courseID, title, content, peopleObject, sender } = req.body;
        try {
            await Announcement.create({ 
                courseID: courseID,
                title: title,
                content: content,
                recipents: peopleObject.map(person => person.toLowerCase()),
                sender: sender.toLowerCase(),
                type: 'send_to_all',
            });
            res.status(200).json( { message: 'Send announcement to all successfully' })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_all/list
    async admin_send_to_all_list(req, res) {
        res.locals.user = req.user;
        try {
            const announcements = await Announcement.find({ type: 'send_to_all' });
            res.render('announcement/toAll/list', { announcements });
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_all/delete/:id
    async admin_send_to_all_delete(req, res) {
        const announcementID = req.params.id;
        try {
            // Delete announcement
            console.log('Delete announcement: ', announcementID);
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // GET /admin/announcement/send_to_teacher
    async admin_send_to_teacher_get(req, res) {
        const teachers = await Teacher.find();
        res.render('announcement/toTeacher/sendToTeacher', { teachers } );
    }

    // POST /admin/announcement/send_to_teacher
    async admin_send_to_teacher_post(req, res) {
        const { courseID, title, content, teacherIDs, sender } = req.body;
        console.log(req.body)
        try {
            await Announcement.create({
                courseID: courseID,
                title: title,
                content: content,
                recipents: teacherIDs.map(teacherID => teacherID.toLowerCase()),
                sender: sender.toLowerCase(),
                type: 'send_to_teacher',
            });
            res.status(200).json( { message: 'Send announcement to teachers successfully' })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_teacher/list
    async admin_send_to_teacher_list(req, res) {
        res.locals.user = req.user;
        try {
            const announcements = await Announcement.find( { type: 'send_to_teacher' } );
            res.render('announcement/toTeacher/list', { announcements });
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_teacher/delete/:id
    async admin_send_to_teacher_delete(req, res) {
        const announcementID = req.params.id;
        try {
            await Announcement.deleteOne({ _id: announcementID })
            res.redirect('/admin/announcement/send_to_teacher/list');
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // GET /admin/announcement/send_to_student
    async admin_send_to_student_get(req, res) {
        const students = await Student.find();
        res.render('announcement/toStudent/sendToStudent', { students });
    }

    // POST /admin/announcement/send_to_student
    async admin_send_to_student_post(req, res) {
        const { courseID, title, content, studentIDs, sender } = req.body;
        try {
            await Announcement.create({
                courseID: courseID,
                title: title,
                content: content,
                recipents: studentIDs.map(studentID => studentID.toLowerCase()),
                sender: sender.toLowerCase(),
                type: 'send_to_student',
            });
            res.status(200).json( { message: 'Send announcement to students successfully' })
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_student/list
    async admin_send_to_student_list(req, res) {
        res.locals.user = req.user;
        try {
            const announcements = await Announcement.find( { type: 'send_to_student' } );
            res.render('announcement/toStudent/list', { announcements });
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_student/delete/:id
    async admin_send_to_student_delete(req, res) {
        const announcementID = req.params.id;
        try {
            await Announcement.deleteOne({ _id: announcementID })
            res.redirect('/admin/announcement/send_to_student/list');
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }
    /* END ANNOUNCEMENT */

}

module.exports = new AdminController()