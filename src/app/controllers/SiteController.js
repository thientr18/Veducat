class SiteController {

  home_get (req, res) {
    res.render('home');
  }
}

module.exports = new SiteController()


