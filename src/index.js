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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use('/storage', express.static(path.join(__dirname, 'storage')));
app.use('/storage', express.static('storage'));

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
    const server = app.listen(process.env.PORT)

    const io = require('socket.io')(server)

    var usp = io.of('/user')
    usp.on('connection', onConnected)
    function onConnected(socket) {
      console.log('Socket connected')

    
      socket.on('disconnect', () => {
        console.log('Socket disconnected')

      })
    
      socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data)
      })

    }

  })
  .catch((err) => console.log(err));



