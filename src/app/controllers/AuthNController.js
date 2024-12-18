const jwt = require('jsonwebtoken');
const User = require('../models/User');

const handleErrors = (err) => {
    console.error(err.message);
    let errors = { userID: '', password: '' };
  
    // incorrect userID
    if (err.message === 'incorrect user ID') {
        errors.userID = 'that user ID is not registered';
    }
  
    // incorrect password
      if (err.message === 'incorrect password') {
        errors.password = 'that password is not incorrect';
    }
  
    // duplicate errors
    if (err.code === 11000) {
        errors.userID = 'this user ID is already in use'
        return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 120 * 60 // 15 minutes
const createToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: maxAge
    })
}
  
module.exports.login_get = (req, res) => {
    const user = res.locals.user;
    if (user) {
        switch (user.role) {
            case 'admin':
                res.redirect('/admin');
                break;
            case 'teacher':
                res.redirect('/teacher');
                break;
            case 'student':
                res.redirect('/student');
                break;
            default:
                break;
        }
    }
    res.render('login');
}
  
module.exports.login_post = async (req, res) => {
    const { userID, password } = req.body;
  
    try {
        const user = await User.login(userID, password )
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });  // maxAge in milliseconds
        res.status(200).json({ user: user._id})
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({ errors })
    }
}
  
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}