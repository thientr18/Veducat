const { checkUser } = require('../app/middlewares/authN');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { requireAuthN } = require('../app/middlewares/authN');

const siteRouter = require('./site');
const courseRouter = require('./course');

function route(app) {
    // routes
    app.get('*', checkUser)
    app.use('/course', requireAuthN, courseRouter)
    app.use('/', siteRouter)
    
}

module.exports = route;