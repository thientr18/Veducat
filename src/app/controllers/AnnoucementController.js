const Annoucement = require('../models/Annoucement');
const Student = require('../models/Student');
const ProgressingCourse = require('../models/ProgressingCourse');
const Teacher = require('../models/Teacher');

// const handleErrors = (err) => {
//     console.error(err.message);
//     let errors = { title: '', content: '' };

//     // incorrect title
//     if (err.message === 'incorrect title') {
//         errors.title = 'that title is not registered';
//     }

//     // incorrect content
//     if (err.message === 'incorrect content') {
//         errors.content = 'that content is not incorrect';
//     }

//     // duplicate errors
//     if (err.code === 11000) {
//         errors.title = 'this title is already in use'
//         return errors;
//     }

//     // validation errors
//     if (err.message.includes('annoucement validation failed')) {
//         Object.values(err.errors).forEach(({ properties }) => {
//             errors[properties.path] = properties.message;
//         })
//     }
//     return errors;
// }

// controller actions
    async function student_annoucement_get(req, res) {
        const { studentIDs } = req.body; //  studentIDs: [studentID1, studentID2, ...]

        try {
            const student = await Student.find({ studentID: { $in: studentIDs } });
            const progressingCourses = await ProgressingCourse.find({ students: { $in: studentIDs } });
            const teacherIDs = progressingCourses.map(progressingCourse => progressingCourse.teacherID);
            const teachers = await Teacher.find({ teacherID: { $in: teacherIDs } });
            const annoucements = await Annoucement.find({ teacherID: { $in: teacherIDs } });
            res.render('student/annoucement', { student, progressingCourses, teachers, annoucements });
        }
        catch (err) {
            res.status(400).json({ err })
        }
    }