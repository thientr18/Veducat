

class TestController {

    // [GET] /
    test(req, res) {
        res.json({
            message: 'Hello Testing!'
        })
    }

    // [GET] /test
    subTest(req, res) {
        res.json({
            message: 'Hello SUB Testing!'
        })
    }

}

module.exports = new TestController()