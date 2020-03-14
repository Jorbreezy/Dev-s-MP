const express = require('express');
const fs = require('fs');
const controller = require('../controller/userController');

const router = express.Router();
//ROUTES

router.post('/login', controller.login, (req, res) => {
  res.status(200).json({"message":"Login Successful"});
})

router.post('/signup', controller.signUp, (req, res) => {
  res.status(200).send({"message":"Signup Successful"});
})



module.exports = router;