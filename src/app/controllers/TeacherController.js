class TecherController {

    course_get(req, res) {
        res.json('teacher/course');
    }
}

module.exports = new TecherController()