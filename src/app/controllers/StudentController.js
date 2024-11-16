class SiteController {

    course_get(req, res) {
        res.render('student/course');
    }
}

module.exports = new SiteController()