const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuthZ = (permission) => async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log('ERROR: 1', err.message);
                return res.redirect('/login');
            } else {
                let user = res.locals.user;
                if (!user || !user.role) {
                    console.log('ERROR: 2');
                    res.cookie('jwt', '', { maxAge: 1 });
                    return res.redirect('/login');
                }
                if (!permission.includes(user.role)) {
                    console.log('ERROR: 3');
                    console.log(user.role);
                    console.log(permission);
                    res.cookie('jwt', '', { maxAge: 1 });
                    return res.redirect('/login');
                }
                next();
            }
        });
    } else {
        console.log('ERROR: 4');
        return res.redirect('/login');
    }
};

module.exports = { requireAuthZ };