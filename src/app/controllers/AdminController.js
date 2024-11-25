const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const User = require('../models/User');

class AdminController {

    admin_get(req, res) {
        res.json('admin');
    }

    admin_post(req, res) {
        res.json('admin');
    }

    async admin_edit_student_get(req, res) {
        try {
            const students = await Student.find();
            res.render('admin/manage_student/editStudent', { students });
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    async admin_edit_student_put(req, res) {
        const { studentID, name, DoB, email } = req.body;
        try {
            await Student.updateOne({ studentID: studentID }, {studentID: studentID, name: name, DoB: DoB, email: email })

            res.redirect('/admin/manage_student/list')
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    async admin_edit_student_delete(req, res) {
        const studentID = req.params.id;
        try {
            await Student.deleteOne({ studentID: studentID })
            await User.deleteOne({ userID: studentID })

            res.redirect('/admin/manage_student/list')
        }
        catch (err) {
            res.status(400).json( {err} )
        }
    }

    admin_insert_student_get(req, res) {
        res.render('admin/manage_student/insertStudent');
    }

    async admin_insert_student_post(req, res) {
        const {studentID, name, DoB, email} = req.body;
    
        try {
            await User.create({ userID: studentID})
            await Student.create({ studentID: studentID,
                                    name: name, 
                                    DoB: DoB, 
                                    email: email })
            console.log('Insert student successfully')
        }
        catch (err) {
            res.status(400).json( {err} )
        }
        res.redirect('/admin/manage_student/list')  
    }
}

module.exports = new AdminController()