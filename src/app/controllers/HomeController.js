

class HomeController {
    test(req, res) {
        res.json({
            message: 'Hello Testing!'
        })
    }
    home(req, res) {
        res.render('home')
    }

}

module.exports = new HomeController()