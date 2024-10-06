

class SiteController {

  signup_get (req, res) {
    res.render('signup');
  }
  
  login_get (req, res) {
    res.render('login');
  }

  home_get (req, res) {
    res.render('home');
  }
}

module.exports = new SiteController()


