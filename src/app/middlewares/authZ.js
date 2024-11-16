const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuthZ = (permission) => (req, res, next) => {
    const token = req.cookies.jwt;
    
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            let role = res.locals.user.role;
            if (err) {
                console.log(err.message);
                res.redirect('/login')
            } else {
                if (!role) {
                    res.cookie('jwt', '', { maxAge: 1 });
                    res.redirect('/login')
                }
                if (!permission.includes(role)) {
                    res.cookie('jwt', '', { maxAge: 1 });
                    res.redirect('/login')
                }
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

module.exports = { requireAuthZ };