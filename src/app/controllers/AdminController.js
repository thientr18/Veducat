class AdminController {

    course_get(req, res) {
        res.render('admin/course');
    }
}

module.exports = new AdminController()