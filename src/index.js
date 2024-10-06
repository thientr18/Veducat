const path = require('path')
const express = require('express')
const morgan = require('morgan')
const sass = require('node-sass')
const route = require('./routes/index')
const app = express()
const port = 3000

// middleware
app.use(express.static(path.join(__dirname, 'public')))

console.log(path.join(__dirname, 'public'))
// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// HTTP logger
app.use(morgan('combined')) 

// Initalize routes
route(app)

// Initialize database connection

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})