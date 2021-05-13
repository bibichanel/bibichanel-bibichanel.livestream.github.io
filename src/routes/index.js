const searchRouter = require('./livestream')
const siteRouter = require('./site')

function route(app) {
    app.use('/livestream', searchRouter);
    app.use('/', siteRouter);
}

module.exports = route;