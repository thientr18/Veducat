const path = require('path')
const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const sass = require('node-sass')
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})