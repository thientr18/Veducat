const express = require('express');
const studentController = require('../app/controllers/StudentController');
const { requireAuthZ } = require('../app/middlewares/authZ');
const { checkUser } = require('../app/middlewares/authN');
const router = express.Router()

// GET /student
router.get('/', checkUser, studentController.index_get);

module.exports = router;