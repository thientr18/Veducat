const siteRouter = require('./site')
const { checkUser } = require('../app/middlewares/authNMiddleware');

function route(app) {
    // routes
    app.get('*', checkUser) 
    app.use('/', siteRouter)
    
}

module.exports = route;