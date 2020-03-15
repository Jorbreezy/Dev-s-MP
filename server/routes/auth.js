const express = require('express');
const fs = require('fs');
const controller = require('../controller/userController');

const router = express.Router();
//ROUTES

router.post('/login', controller.login);

router.post('/signup', controller.signUp);



module.exports = router;