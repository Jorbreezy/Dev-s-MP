const db = require("../models/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const controller = {
  login(req, res, next) {
    const text = "SELECT password FROM users WHERE users.username=$1";
    const { username, password } = req.body;

    db.query(text, [username], (err, data) => {
      if (err) return next(err);
      const results = data.rows;

      if (results.length === 0)
        return res.status(418).json({ message: "this is invalid" });

      const dbPassword = results[0].password;
      bcrypt.compare(password, dbPassword, (err, bool) => {
        if (bool) {
          const token = jwt.sign({ authorized: "true" }, secret, {
            algorithm: "HS256",
            expiresIn: 60 * 60 * 12
          }); //expiresIn is in seconds
          res.cookie("authorization", token, {
            maxAge: 43200000,
            httpOnly: true
          });
          // const usernameJWT = jwt.sign({ username: username }, secret, {
          //   algorithm: "HS256",
          //   expiresIn: 60 * 60 * 12
          // });
          // res.cookie("username", usernameJWT, {
          //   maxAge: 43200000,
          //   httpOnly: true
          // });
          // res.set({"authorization": token});
          return res.status(200).json({ message: "Login Successful" });
        } else {
          return res
            .status(418)
            .json({ message: "this is wrong username/password" });
        }
      });
    });
  },
  signUp(req, res, next) {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const text = "SELECT * FROM users WHERE users.username = $1";
    const text2 = "INSERT INTO users (username, password) VALUES ($1, $2)";

    db.query(text, [username], (err, data) => {
      if (err) return next(err);

      if (data.rows.length === 0) {
        db.query(text2, [username, hash], () => {
          if (err) return next(err);

          let token = jwt.sign({ authorized: "true" }, secret, {
            algorithm: "HS256",
            expiresIn: 60 * 60 * 12
          }); //expiresIn is in seconds
          res.cookie("authorization", token, {
            maxAge: 43200000,
            httpOnly: true
          });
          let usernameJWT = jwt.sign({ username: username }, secret, {
            algorithm: "HS256",
            expiresIn: 60 * 60 * 12
          });
          res.cookie("username", usernameJWT, {
            maxAge: 43200000,
            httpOnly: true
          });
        });
      }
    });
  }
};

module.exports = controller;
