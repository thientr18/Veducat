const path = require('path');
const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')

const app = express()
const port = 3000

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
);

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources/views'));


app.get('/', (req, res) => {
  res.render('home')
})

app.get('/test', (req, res) => {
  res.send('Hello Testing!')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})