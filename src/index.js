const path = require('path')
const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const sass = require('node-sass')
const route = require('./routes/index')

const app = express()
const port = 3000

// middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// HTTP logger
app.use(morgan('combined')) 

// Initalize routes
route(app)

// Initialize database connection
const dbURI = 'mongodb+srv://thientr18:thien18803@cluster0.ohxbs.mongodb.net/Veducat';
mongoose.connect(dbURI)
  .then((result) => {
    console.log('Connected to MongoDB: http://localhost:3000');
    app.listen(port)
  })
  .catch((err) => console.log(err));