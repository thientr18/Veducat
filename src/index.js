const path = require('path')
const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const route = require('./routes/index')

const dotenv = require('dotenv');
dotenv.config();

const app = express();

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
mongoose.connect(process.env.MONGO_DB)
  .then((result) => {
    console.log('Connected to MongoDB: http://localhost:3000');
    app.listen(process.env.PORT)
  })
  .catch((err) => console.log(err));