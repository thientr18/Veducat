const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const ProgressingCourse = require('../models/ProgressingCourse');
const Announcement = require('../models/Announcement');
const Material = require('../models/Material');
const MaterialFile = require('../models/MaterialFile');
const Task = require('../models/Task');
const TaskFile = require('../models/TaskFile');
const Student = require('../models/Student');
const TaskforStudent = require('../models/TaskforStudent');
const multer = require('multer');
const Discussion = require('../models/Discussion');
const DiscussionFile = require('../models/DiscussionFile');
const Submission = require('../models/Submission');
const SubmissionFile = require('../models/SubmissionFiles');

class TeacherController {

    // GET /teacher
    async index_get (req, res, next) {
        const user = res.locals.user;

        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            const pCourses = await ProgressingCourse.find({ teacherID: teacher.teacherID });
            if (!pCourses.length) {
                return res.render('teacher/index', { user, teacher, teacherCourses: [], announcements: [] });
            }
            const courses = await Course.find({ courseID: { $in: pCourses.map(pc => pc.courseID) } });
            const teacherCourses = pCourses.map(pCourse => {
                const course = courses.find(c => c.courseID === pCourse.courseID);
                return {
                    ...pCourse._doc,
                    name: course?.name || null,
                    description: course?.description || null
                };
            });

            const announcements = await Announcement.find({ receivers: teacher.teacherID });
            if (!announcements.length) {
                return res.render('teacher/index', { user, teacher, teacherCourses, announcements: [] });
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
            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            res.render('teacher/course', { user, teacher, pCourse });
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
            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const announcements = await Announcement.find({ pCourseID: pCourse._id });


            res.render('teacher/course_announcement', { user, teacher, pCourse, announcements });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // POST /teacher/course/:_id/announcement
    async announcement_post (req, res, next) {
        const user = res.locals.user;
        let pCourseID = req.params._id;
        let { title, content, senderID, receivers } = req.body;

        pCourseID = pCourseID.toLowerCase();
        senderID = senderID.toLowerCase();
        receivers = receivers.map(receiver => receiver.toLowerCase());
        try {
            await Announcement.create({ pCourseID: courseID, title, content, sender, recipents, type });
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
            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const materials = await Material.find({ pCourseID: pCourse._id });

            res.render('teacher/course_material', { user, teacher, pCourse, materials });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async material_detail_get (req, res, next) {
        const user = res.locals.user;
        const { _id, mID } = req.params;

        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            
            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const material = await Material.findById({ _id: mID });
            const files = await MaterialFile.find({ materialID: material._id });

            res.render('teacher/course_material_display', { user, teacher, progressingCourse, material,files });
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

            try {
                const teacher = await Teacher.findOne({ teacherID: user.userID });
                if (!teacher) {
                    return res.status(404).json({ message: "Teacher not found" });
                }

                if(files.file == null){
                    await Material.create({
                        pCourseID : courseID,
                        title : title,
                        description : description,
                        uploadedBy: teacher.teacherID,
                    });

                } else{
                    const material = await Material.create({
                        pCourseID: courseID,
                        title : title,
                        description : description,
                        uploadedBy: teacher.teacherID,
                    });
                    const uploadFiles = files.file.map(file => ({
                        materialID: material._id,
                        materialName: title,
                        fileName: file.originalname,
                        filePath: file.path,
                        fileType: file.mimetype,
                        fileSize: file.size,
                    }));
                    await MaterialFile.create(uploadFiles);
                }                
                res.status(201).json({ message: "Material uploaded successfully" });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }

    async discussion_post (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        const {pCourseID, topic, description,title} = req.body;
        const files = req.files;

        upload(req, res, async (err) => {

            try {
                const teacher = await Teacher.findOne({ teacherID: user.userID });
                if (!teacher) {
                    return res.status(404).json({ message: "Teacher not found" });
                }

                if(files.file == null){
                    await Discussion.create({
                        pCourseID : pCourseID,
                        title : title,
                        topic: topic,
                        description : description,
                        uploadedBy: teacher.teacherID,
                    });
                } else{
                    const discussion = await Discussion.create({
                        pCourseID : pCourseID,
                        title : title,
                        topic: topic,
                        description : description,
                        uploadedBy: teacher.teacherID,
                    });
                    
                    const uploadFiles = files.file.map(file => ({
                        discussionID: discussion._id,
                        discussionTopic: topic,
                        fileName: file.originalname,
                        filePath: file.path,
                        fileType: file.mimetype,
                        fileSize: file.size,
                    }));
                    await DiscussionFile.create(uploadFiles);
                }                
                res.status(201).json({ message: "Dicussion uploaded successfully" });

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
            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            
            const students = await Student.find({ studentID: { $in: pCourse.students } });

            res.render('teacher/course_contact', { user, teacher, pCourse, students });
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
            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const homeworks = await Task.find({ pCourseID: pCourse._id });

            res.render('teacher/course_homework', { user, teacher, pCourse, homeworks });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    // GET /teacher/course/:_id/homework/:_id
    async homework_detail_get (req, res, next) {
        const user = res.locals.user;
        const { _id, hID } = req.params;
        
        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });
            
            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const homework = await Task.findById({ _id: hID });
            const files = await TaskFile.find({ taskID: homework._id });

            res.render('teacher/course_homework_display', { user, teacher, pCourse, homework, files });
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
            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            res.render('teacher/course_discussion', { user, teacher, pCourse });
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
            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };

            const tasks = await Task.find({ pCourseID: pCourse._id });

            res.render('teacher/course_grade', { user, teacher, pCourse, tasks });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async grade_detail_get (req, res, next) {
        const user = res.locals.user;
        const { _id, hID } = req.params;

        try {
            const teacher = await Teacher.findOne({ teacherID: user.userID });

            let pCourse = await ProgressingCourse.findById(_id)
            const course = await Course.findOne({ courseID: pCourse.courseID });
            pCourse = { ...pCourse._doc, courseName: course.name, courseDescription: course.description };
            
            const homework = await Task.findById(hID);
            const submission = await Submission.find({ taskID: homework._id });
            const students = await Student.find({ studentID: { $in: submission.map(s => s.studentID) } });

            const list = await Promise.all(submission.map(async sub => {
                const student = students.find(s => s.studentID === sub.studentID);
                const files = await SubmissionFile.find({ submissionID: sub._id });
                return {
                    ...sub._doc,
                    studentName: student?.name || null,
                    studentID: student?.studentID || null,
                    files
                };
            }));

            res.render('teacher/course_grade_display', { user, teacher, pCourse, homework, list });
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
            const announcements = await Announcement.find({ receivers: teacher.teacherID });

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

            const pCourses = await ProgressingCourse.find({ teacherID: teacher.teacherID });
            if (!pCourses.length) {
                return res.render('teacher/index', { user, teacher, teacherCourses: [], announcements: [] });
            }
            const courses = await Course.find({ courseID: { $in: pCourses.map(pc => pc.courseID) } });
            const teacherCourses = pCourses.map(pCourse => {
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

            const pCourses = await ProgressingCourse.find({ teacherID: teacher.teacherID });
            if (!pCourses.length) {
                return res.render('teacher/index', { user, teacher, teacherCourses: [], announcements: [] });
            }
            const courses = await Course.find({ courseID: { $in: pCourses.map(pc => pc.courseID) } });
            const teacherCourses = pCourses.map(pCourse => {
                const course = courses.find(c => c.courseID === pCourse.courseID);
                return {
                    ...pCourse._doc,
                    name: course?.name || null,
                    description: course?.description || null
                };
            });

            res.render('teacher/discussion', { user, teacher, teacherCourses, pCourses });
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
    // get /course/:_id/material/delete/:_id
    async teacher_delete_material(req, res, next) {
        const { _id } = req.params;
        try {
            const material = await Material.findById( _id);
            if(!material){
                return res.status(404).json({ message: "Material not found" });
            }

            let pCourse = await ProgressingCourse.findById(material.courseID);
            await MaterialFile.deleteMany({ materialID: material._id });
            await Material.findByIdAndDelete(_id);
            res.redirect(`/teacher/course/${pCourse._id}/material`);
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // put /course/:_id/material/edit/:_id
    async teacher_edit_material(req, res) {
        const { _id } = req.params;
        const {title, description} = req.body;
        const files = req.files;

        upload(req, res, async (err) => {
            try {
                const material = await Material.findById( _id);

                if(files == null){
                    await Material.updateOne(
                        {_id : _id},
                        {title : title,
                        description : description}
                    );
                    await MaterialFile.deleteMany({ materialID: material._id });
                } else{
                    await Material.updateOne(
                        {_id : _id},
                        {title : title,
                        description : description}
                    );
                    const uploadFiles = files.file.map(file => ({
                        materialID: material._id,
                        materialName: title,
                        fileName: file.originalname,
                        filePath: file.path,
                        fileType: file.mimetype,
                        fileSize: file.size,
                    }));
                    await MaterialFile.deleteMany({ materialID: material._id });
                    await MaterialFile.create(uploadFiles);
                }               
                res.status(201).json({ message: "Material uploaded successfully" });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // POST /teacher/course/:_id/homework
    async homework_post (req, res, next) {
        const user = res.locals.user;
        const { _id } = req.params;
        const { title, description,deadline} = req.body;
        const files = req.files;

        upload(req, res, async (err) => {

            try {
                const teacher = await Teacher.findOne({ teacherID: user.userID });
                if (!teacher) {
                    return res.status(404).json({ message: "Teacher not found" });
                }
                const progressingCourse = await ProgressingCourse.findById(_id);
                const students = await Student.find({ studentID: { $in: progressingCourse.students } });
                if(files.file == null){
                    await Task.create({
                        pCourseID :_id,
                        title : title,
                        description : description,
                        taskType: "homework",
                        dueDate: deadline,
                        assignedBy: teacher.teacherID,
                        createdAt: Date.now(),
                    });
                    console.log(students);
                    students.forEach(async student => {
                        await TaskforStudent.create({
                            studentID: student.studentID, taskID: homework._id});
                    });
                } else{
                    const homework = await Task.create({
                        pCourseID : _id,
                        title : title,
                        description : description,
                        taskType: "homework",
                        dueDate: deadline,
                        assignedBy: teacher.teacherID,
                        createdAt: Date.now(),
                    });
                    students.forEach(async student => {
                        await TaskforStudent.create({
                            studentID: student.studentID, taskID: homework._id});
                    });

                    const uploadFiles = files.file.map(file => ({
                        taskID: homework._id,
                        taskName: title,
                        fileName: file.originalname,
                        filePath: file.path,
                        fileType: file.mimetype,
                        fileSize: file.size,
                    }));
                    await TaskFile.create(uploadFiles);
                }                
                res.status(201).json({ message: "Homework uploaded successfully" });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // get /course/:_id/homework/delete/:_id
    async teacher_delete_homework(req, res, next) {
        const { _id } = req.params;
        try {
            const homework = await Task.findById( _id);
            if(!homework){
                return res.status(404).json({ message: "Homework not found" });
            }

            let progressingCourse = await ProgressingCourse.findById(homework.pCourseID);
            await TaskFile.deleteMany({ taskID: homework._id });
            await Task.findByIdAndDelete(_id);
            res.redirect(`/teacher/course/${progressingCourse._id}/homework`);
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    // put /course/:_id/homework/edit/:_id
    async teacher_edit_homework(req, res) {
        const { _id,hID } = req.params;
        const {title, description,deadline} = req.body;
        const files = req.files;

        console.log(files, title, description, deadline);

        upload(req, res, async (err) => {
            try {
                const homework = await Task.findById( hID);
                console.log(homework);
                if(files.file == null){
                    await Task.updateOne(
                        {_id : hID},
                        {title : title,
                        description : description,
                        dueDate: deadline,
                        updateAt: Date.now()}
                    );
                    await TaskFile.deleteMany({ taskID: homework._id });
                } else{
                    await Task.updateOne(
                        {_id : hID},
                        {title : title,
                        description : description,
                        dueDate: deadline,
                        updateAt: Date.now()}
                    );
                    const uploadFiles = files.file.map(file => ({
                        taskID: homework._id,
                        taskName: title,
                        fileName: file.originalname,
                        filePath: file.path,
                        fileType: file.mimetype,
                        fileSize: file.size,
                    }));
                    await TaskFile.deleteMany({ taskID: homework._id });
                    await TaskFile.create(uploadFiles);
                }               
                res.status(201).json({ message: "Homework uploaded successfully" });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }


}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/teacher');
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