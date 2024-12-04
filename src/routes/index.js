const { checkUser } = require('../app/middlewares/authN');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { requireAuthN } = require('../app/middlewares/authN');

const student = require('./student');
// const teacher = require('./teacher');
const admin = require('./admin');
const siteRouter = require('./site');


function route(app) {
    // routes
    app.get('*', checkUser)
    app.use('/student', student) 
    app.use('/admin', admin)
    app.use('/', siteRouter)
    
}

module.exports = route;