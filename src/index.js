const path = require('path')
const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const sass = require('node-sass')
const mysql = require('mysql');
const app = express()
const port = 3000
const route = require('./routes')

app.use(express.static(path.join(__dirname, 'public')))

// HTTP logger
app.use(morgan('combined')) 

// Register `hbs.engine` with the Express app.
app.engine(
  'hbs', 
  exphbs.engine({
    extname: '.hbs',
    helpers: {

    }
  })
)
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'resources/views'))

// Initalize routes
route(app)

// Initialize database connection
const connection = mysql.createConnection({
  host: '172.17.33.102',
  user:'root',
  password:'password',
  database:'lab1'
});
connection.connect((error) => {
  if (error) {
      console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})