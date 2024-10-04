

class SiteController {

    // [GET] /
    home(req, res) {
        res.render('home')
    }

    // [GET] /test
    test(req, res) {
        res.json({
            message: 'Hello Testing!'
        })
    }

}

module.exports = new SiteController()