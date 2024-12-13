const Admin = require('../models/Admin');
const Announcement = require('../models/Announcement');
const Course = require('../models/Course');
const Discussion = require('../models/Discussion');
const Grade = require('../models/Grade');
const Material = require('../models/Material');
const MaterialFile = require('../models/MaterialFile');
const Message = require('../models/Message');
const ProgressingCourse = require('../models/ProgressingCourse');
const Student = require('../models/Student');
const Submission = require('../models/Submission');
const Task = require('../models/Task');
const TaskforStudent = require('../models/TaskforStudent');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

class AdminController {

    // GET /admin
    admin_get(req, res, next) {
        res.render('admin/index');
    }

    /*--- START manage STUDENT---*/ 
    // GET /admin/manage_student/insert
    admin_insert_student_get(req, res, next) {
        res.render('admin/manage_student/insertStudent');
    }

    // POST /admin/manage_student/insert
    async admin_insert_student_post(req, res, next) {
        let {studentID, name, DoB, email} = req.body;
        studentID = studentID.toLowerCase();
        email = email.toLowerCase();
        try {
            await User.create({ userID: studentID})
            await Student.create({ studentID, name, DoB, email });
            const course = await Course.findOne({ courseID: 'admin' });
            if (!course) {
                await Course.create({ courseID: 'admin', name: 'Admin', description: 'Admin course' });
            }
            const pCourse = await ProgressingCourse.findOne({ courseID: 'admin' });
            if (!pCourse) {
                await ProgressingCourse.create({ courseID: 'admin', teacherID: 'admin', students: [studentID] });
            } else {
                await ProgressingCourse.updateOne(
                    { courseID: 'admin' }, 
                    { $push: { students: studentID },
                    updateAt: Date.now()
                });
            }

            res.status(200).send({ message: 'Insert student successfully' })
        } catch (err) {
            console.log(err)
            res.status(400).send({err})
        }
    }

    // GET /admin/manage_student/list
    async admin_edit_student_get(req, res, next) {
        try {
            let students = await Student.find();
            const courseOfStudent = await ProgressingCourse.find({ students: { $in: students.map(student => student.studentID) } });
            students = students.map(student => {
                const course = courseOfStudent.find(course => course.students.includes(student.studentID));
                return { ...student._doc, courseID: course.courseID };
            });
            res.render('admin/manage_student/editStudent', { students });
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // PUT /admin/manage_student/edit/:id
    async admin_edit_student_put(req, res, next) {
        let studentID = req.params.id;
        let { name, DoB, email } = req.body;
        studentID = studentID.toLowerCase();
        email = email.toLowerCase();
        try {
            await Student.updateOne({ studentID: studentID }, { name, DoB, email, updateAt: Date.now() })
            res.status(200).json( { message: 'Update student successfully' })
        } catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // /manage_student/delete/:id
    async admin_edit_student_delete(req, res, next) {
        let studentID = req.params.id;
        studentID = studentID.toLowerCase();
        try {
            await Student.deleteOne({ studentID: studentID })
            await User.deleteOne({ userID: studentID })
            await ProgressingCourse.updateMany({}, { $pull: { students: studentID } });
            await Announcement.updateMany({}, { $pull: { receivers: studentID } });
            await Discussion.updateMany({}, { $pull: { studentID: studentID } });
            await Submission.deleteMany({ studentID: studentID });
            await Message.deleteMany({ senderID: studentID });
            await Grade.deleteMany({ studentID: studentID });

            res.status(200).json({ message: 'Delete student successfully' })
        } catch (err) {
            console.log(err)
            res.status(400).json({err})
        }
    }

    // Delete many students


    /*--- End manage student ---*/ 

    /*--- START manage teacher---*/ 
    // GET /admin/manage_teacher/insert
    admin_insert_teacher_get(req, res, next) {
        res.render('admin/manage_teacher/insertTeacher');
    }

    // POST /admin/manage_teacher/insert
    async admin_insert_teacher_post(req, res, next) {
        let {teacherID, name, DoB, email} = req.body;
        teacherID = teacherID.toLowerCase();
        email = email.toLowerCase();
        try {

            await User.create({ userID: teacherID, role: 'teacher' })
            await Teacher.create({ teacherID, name, DoB, email })
            res.status(201).json( { message: 'Insert teacher successfully' })
        } catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // GET /admin/manage_teacher/list
    async admin_edit_teacher_get(req, res, next) {
        try {
            const teachers = await Teacher.find();
            res.render('admin/manage_teacher/editTeacher', { teachers });
        } catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // PUT /admin/manage_teacher/edit/:id
    async admin_edit_teacher_put(req, res, next) {
        let teacherID = req.params.id;
        let { name, DoB, email } = req.body;
        teacherID = teacherID.toLowerCase();
        email = email.toLowerCase();
        try {
            await Teacher.updateOne({ teacherID }, { name, DoB, email, updateAt: Date.now() })
            res.status(200).json( { message: 'Update teacher successfully' })
        } catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // /manage_teacher/delete/:id
    async admin_edit_teacher_delete(req, res, next) {
        let teacherID = req.params.id;
        teacherID = teacherID.toLowerCase();
        try {
            const pCourses = await ProgressingCourse.find({ teacherID });
            if (pCourses.length > 0) {
                return res.status(400).json({
                        message: "Teacher is teaching a course, please delete the course first.",
                        hasCourses: true
                    })
            } else {
                await Teacher.deleteOne({ teacherID });
                await User.deleteOne({ userID: teacherID });
                await Announcement.updateMany({}, { $pull: { receivers: teacherID } });
                
                res.status(200).json({ message: 'Delete teacher successfully' })
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }
    /*--- END manage teacher---*/ 

    /*--- START manage COURSE---*/     
    // GET /admin/manage_course/insert
    admin_insert_course_get(req, res, next) {
        res.render('admin/manage_course/insertCourse');
    }

    // POST /admin/manage_course/insert
    async admin_insert_course_post(req, res, next) {
        let { courseID, name, description } = req.body;
        courseID = courseID.toLowerCase();
        try {
            await Course.create({ courseID, name, description })
            res.status(201).json( { message: 'Insert course successfully' })
        } catch (err) {
            console.log(err);
            res.status(400).json({err})
        }
    }

    // GET /admin/manage_course/list
    async admin_edit_course_get(req, res, next) {
        try {
            const courses = await Course.find();
            res.render('admin/manage_course/editCourse', { courses });
        } catch (err) {
            res.status(400).json({err})
        }
    }

    // PUT /admin/manage_course/edit/:id
    async admin_edit_course_put(req, res, next) {
        let courseID = req.params.id;
        let { name, description } = req.body;
        courseID = courseID.toLowerCase();
        name = name.toLowerCase();
        description = description.toLowerCase();
        try {
            await Course.updateOne({ courseID }, { name, description, updateAt: Date.now() })
            res.status(200).json( { message: 'Update course successfully' })
        } catch (err) {
            res.status(400).json({err})
        }
    }

    // /manage_course/delete/:id
    async admin_edit_course_delete(req, res, next) {
        let courseID = req.params.id;
        courseID = courseID.toLowerCase();
        try {
            const pCourses = await ProgressingCourse.find({ courseID });
            if (pCourses.length > 0) {
                return res.status(400).json({ 
                    message: "Course is being taught, please delete the course first.",
                    hasCourses: true 
                })
            } else {
                await Course.deleteOne({ courseID })
                res.status(200).json({ message: 'Delete course successfully' })
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({err})
        }
    }
    /*--- END manage COURSE---*/ 

    /* START PROGRESSING COURSE */
    // GET /admin/manage_course/progressing
    async admin_insert_progressing_course_get(req, res, next) {
        try {
            const courses = await Course.find();
            const teachers = await Teacher.find();
            const students = await Student.find();
            res.render('admin/manage_progressing_course/insertProgressingCourse', { courses, teachers, students });
        } catch (err) {
            console.log(err)
            res.status(400).json({err})
        }
    }

    // POST /admin/manage_course/progressing
    async admin_insert_progressing_course_post(req, res, next) {
        let { courseID, teacherID, studentIDs } = req.body;
        courseID = courseID.toLowerCase();
        teacherID = teacherID.toLowerCase();
        let students = studentIDs.map(studentID => studentID.toLowerCase());

        // Validate required fields
        if (!courseID || !teacherID || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid input: courseID, teacherID, and studentIDs are required.' });
        }
        
        try {
            await ProgressingCourse.create({ courseID, teacherID, students });
            res.status(201).json( { message: 'Insert progressing course successfully' })
        } catch (err) {
            console.log(err)
            res.status(400).json( { message: 'Insert progressing course failed' })
        }
    }

    // GET /admin//manage_progressing_course/list
    async admin_edit_progressing_course_get(req, res, next) {
        try {
            const pCourses = await ProgressingCourse.find();
            const students = await Student.find();
            const studentIDs = students.map(student => student.studentID); // Create an array of student IDs

            res.render('admin/manage_progressing_course/editProgressingCourse', { pCourses, studentIDs });
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // PUT /admin/manage_progressing_course/edit/:id
    async admin_edit_progressing_course_put(req, res, next) {
        let pCourseID = req.params.id;
        let { courseID, teacherID, studentIDs } = req.body;
        courseID = courseID.toLowerCase();
        teacherID = teacherID.toLowerCase();
        let students = studentIDs.map(studentID => studentID.toLowerCase());
        pCourseID = pCourseID.toLowerCase();

        try {
            await ProgressingCourse.updateOne({ _id: pCourseID }, { teacherID, students })
            res.status(200).json( { message: 'Update progressing course successfully' })
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // /manage_progressing_course/delete/:id
    async admin_edit_progressing_course_delete(req, res, next) {
        let pCourseID = req.params.id;
        pCourseID = pCourseID.toLowerCase();

        try {
            await Material.deleteMany({ pCourseID });
            await Discussion.deleteMany({ pCourseID });
            await Announcement.deleteMany({ source: pCourseID });
            const tasks = await Task.find({ pCourseID });
            for (let task of tasks) {
                const submissions = await Submission.find({ taskID: task._id });
                
                for (let submission of submissions) {
                    await Grade.deleteOne({ submissionID: submission._id });
                }
                await Submission.deleteMany({ taskID: task._id });
                await TaskforStudent.deleteMany({ taskID: task._id });
            }
            await Task.deleteMany({ pCourseID });
            await ProgressingCourse.deleteOne({ _id: pCourseID });
            res.status(200).json( { message: 'Delete progressing course successfully' })
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }
    /* END PROGRESSING COURSE */

    /* START ANNOUNCEMENT */
    // GET /admin/announcement/send_to_all
    async admin_send_to_all_get(req, res, next) {
        const user = res.locals.user;
        try {        
            const students = await Student.find();
            const studentIDs = students.map(personID => personID.studentID); // Create an array of student IDs
            const teachers = await Teacher.find();
            const teacherIDs = teachers.map(personID => personID.teacherID); // Create an array of teacher IDs
            const allPeople = [...studentIDs, ...teacherIDs];
            res.render('announcement/toAll/sendToAll', { user, allPeople });
        } catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // POST /admin/announcement/send_to_all
    async admin_send_to_all_post(req, res, next) {
        let { courseID, title, content, receivers, senderID } = req.body;
        courseID = courseID.toLowerCase();
        senderID = senderID.toLowerCase();
        receivers = receivers.map(receiver => receiver.toLowerCase());
        try {
            await Announcement.create({ courseID, title, content, senderID, receivers, type: 'to_all' });
            res.status(200).json( { message: 'Send announcement to all successfully' })
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_all/list
    async admin_send_to_all_list(req, res, next) {
        try {
            const announcements = await Announcement.find({ type: 'to_all' });
            res.render('announcement/toAll/list', { announcements });
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_all/delete/:id
    async admin_send_to_all_delete(req, res, next) {
        const announcementID = req.params.id;
        try {
            await Announcement.deleteOne({ _id: announcementID })
            res.status(200).json( { message: 'Delete announcement successfully' })
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // GET /admin/announcement/send_to_teacher
    async admin_send_to_teacher_get(req, res, next) {
        const user = res.locals.user;
        try {
            const teachers = await Teacher.find();
            res.render('announcement/toTeacher/sendToTeacher', { user, teachers } );
        } catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // POST /admin/announcement/send_to_teacher
    async admin_send_to_teacher_post(req, res, next) {
        let { title, content, teacherIDs, senderID } = req.body;
        teacherIDs = teacherIDs.map(teacherID => teacherID.toLowerCase());
        senderID = senderID.toLowerCase();
        try {
            await Announcement.create({ title, content, receivers: teacherIDs, senderID, type: 'to_teacher' });
            res.status(200).json( { message: 'Send announcement to teachers successfully' })
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_teacher/list
    async admin_send_to_teacher_list(req, res, next) {
        res.locals.user = req.user;
        try {
            const announcements = await Announcement.find( { type: 'to_teacher' } );
            res.render('announcement/toTeacher/list', { announcements });
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_teacher/delete/:id
    async admin_send_to_teacher_delete(req, res, next) {
        const announcementID = req.params.id;
        try {
            await Announcement.deleteOne({ _id: announcementID })
            res.status(200).json( { message: 'Delete announcement successfully' })
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // GET /admin/announcement/send_to_student
    async admin_send_to_student_get(req, res, next) {
        const user = res.locals.user;
        try {
            const students = await Student.find();
            res.render('announcement/toStudent/sendToStudent', { user, students });
        } catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // POST /admin/announcement/send_to_student
    async admin_send_to_student_post(req, res, next) {
        let { pCourseID, title, content, studentIDs, senderID } = req.body;
        pCourseID = pCourseID.toLowerCase();
        studentIDs = studentIDs.map(studentID => studentID.toLowerCase());
        senderID = senderID.toLowerCase();
        try {
            const pCourse = await ProgressingCourse.findOne({ courseID: pCourseID });
            console.log(pCourse)
            if (!pCourse) {
                return res.status(400).json({ message: 'Course does not exist' });
            }
            await Announcement.create({ pCourseID: pCourse._id, title, content, receivers: studentIDs, senderID, type: 'to_student' });
            res.status(200).json( { message: 'Send announcement to students successfully' })
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_student/list
    async admin_send_to_student_list(req, res, next) {
        res.locals.user = req.user;
        try {
            const announcements = await Announcement.find( { type: 'to_student' } );
            res.render('announcement/toStudent/list', { announcements });
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }

    // /announcement/send_to_student/delete/:id
    async admin_send_to_student_delete(req, res, next) {
        const announcementID = req.params.id;
        try {
            await Announcement.deleteOne({ _id: announcementID })
            res.status(200).json( { message: 'Delete announcement successfully' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json( {err} )
        }
    }
    /* END ANNOUNCEMENT */
}

module.exports = new AdminController()