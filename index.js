const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");

const secret = "aksdjhfwqeirouywqoieruydnbmzxc";

const dbURI = "postgres://smabkvvq:Ne2hS2gi8ux0ykfPK0SDrHniW8_Ci2A5@drona.db.elephantsql.com:5432/smabkvvq";
const pool = new Pool({
  connectionString: dbURI
});

app.use(express.static(path.resolve(__dirname, "./dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

function isAuthorized(req, res, next) {
  if (req.cookies.authorized) {
    let authorized = jwt.verify(req.cookies.authorized, secret, {algorithm: "HS256"}).authorized;
    if (authorized) {
      return next();
    }
    else {
      return next("unauthorized access");
    }
  }
  return next("no cookies");
}
// io.on("connection", socket => {
//   socket.join("market");
// });

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.post("/makebid", isAuthorized,(req, res, next) => {
  const { bidAmount, postId } = req.body;
  let user_id = req.cookies.user_id;
  user_id = jwt.verify(user_id, secret, {algorithm: "HS256"}).user_id;
  pool.query(`
  INSERT INTO public.bids (bid_by, amount, post_id, posted_at)
  VALUES ($1, $2, $3, NOW()::timestamp);
  `, [user_id, bidAmount, postId], (err, sqlres) => {
    if (err) {
      return next(err);
    }
    return res.redirect("/getmarkets"); 
  })
})

app.post("/login", (req, res) => {
  const {username, password} = req.body;
  pool.query(`
  SELECT *
  FROM public.users as users
  WHERE users.username = $1;
  `,[username], (err, sqlres) => {
    if (sqlres.rows.length === 0) {
      return res.status(418).send({"message": "invalid username/password"});
    }
    let dbPwd = sqlres.rows[0].password;
    const valid = bcrypt.compareSync(password, dbPwd);
    if (valid) {
      let useridJWT = jwt.sign({"user_id": sqlres.rows[0].user_id}, secret, {algorithm: "HS256", expiresIn: 60*60*12});
      res.cookie("user_id", useridJWT, {maxAge: 43200000, httpOnly: true});
      let usernameJWT = jwt.sign({"username": username}, secret, {algorithm: "HS256", expiresIn: 60*60*12});
      res.cookie("username", usernameJWT, {maxAge: 43200000, httpOnly: true});
      let authorizedJWT = jwt.sign({"authorized": true}, secret, {algorithm: "HS256", expiresIn: 60*60*12});
      res.cookie("authorized", authorizedJWT, {maxAge: 43200000, httpOnly: true});
      return res.status(200).send({"message": "successful login"});
    }
    else {
      return res.status(418).send({"message": "invalid username/password"});
    }
  })
});
app.post("/register", (req, res) => {
  const {username, password} = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPwd = bcrypt.hashSync(password, salt);
  pool.query(`
  SELECT *
  FROM public.users as users
  WHERE users.username = $1;
  `, [username], (err, sqlres) => {
    if (sqlres.rows.length === 0) {
      pool.query(`
      INSERT INTO public.users (username, password)
      VALUES ($1, $2)
      RETURNING user_id;
      `,[username, hashedPwd], (err, sqlres) => {
        let useridJWT = jwt.sign({"user_id": sqlres.rows[0].user_id}, secret, {algorithm: "HS256", expiresIn: 60*60*12});
        res.cookie("user_id", useridJWT, {maxAge: 43200000, httpOnly: true});
        let usernameJWT = jwt.sign({"username": username}, secret, {algorithm: "HS256", expiresIn: 60*60*12});
        res.cookie("username", usernameJWT, {maxAge: 43200000, httpOnly: true});
        let authorizedJWT = jwt.sign({"authorized": true}, secret, {algorithm: "HS256", expiresIn: 60*60*12});
        res.cookie("authorized", authorizedJWT, {maxAge: 43200000, httpOnly: true});
        return res.status(200).send({"message": "successful register"});
      })
    }
  })
});
const arrayify = (arr) => {
  const newArray = [];
  const toBeModified = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].amount === null) {
      newArray.push(arr[i]);
    }
    else {
      toBeModified.push(arr[i]);
    }
  }
  newArray.forEach(el => {
    el.bids = [];
  })

  const helperObj = {};
  for (let i = 0; i < toBeModified.length; i++) {
    let post_id = toBeModified[i].post_id;
    if (helperObj[post_id]) {
      helperObj[post_id].bids.push({
        amount: toBeModified[i].amount,
        username: toBeModified[i].username
      })
    }
    else {
      helperObj[post_id] = {
        post_id: post_id,
        title: toBeModified[i].title,
        description: toBeModified[i].description,
        bids: [{
          amount: toBeModified[i].amount,
          username: toBeModified[i].username
        }]
      }
    }
  }
  const helperKeys = Object.keys(helperObj);
  for (let i = 0; i < helperKeys.length; i ++) {
    newArray.push(helperObj[helperKeys[i]]);
  }
  return newArray;
}
app.get("/getmarkets", isAuthorized, (req, res) => {
  req.io.on("connection", socket => {
    console.log("socket here");
    socket.join("secret-market");
  })
  pool.query(`
  SELECT posts.post_id, 
         posts.title,
         posts.description,
         --bids.post_id as bid_post_id,
         bids.amount, 
         bids.bid_by,
         users.username
  FROM public.posts as posts
  LEFT JOIN public.bids as bids 
  ON bids.post_id = posts.post_id
  LEFT JOIN public.users as users
  ON users.user_id = bids.bid_by
    `, (err, sqlres) => {
     // req.io.to("market").emit("update", sqlres.rows);
      sqlres.rows = arrayify(sqlres.rows);
      console.log(sqlres.rows);

      req.io.to("secret-market").emit("update", sqlres.rows);
      return res.status(200).send(sqlres.rows); 
    });
});
app.post("/addmarket", isAuthorized,(req, res) => {
  let user_id = req.cookies.user_id;
  user_id = jwt.verify(user_id, secret, {algorithm: "HS256"}).user_id;
  pool.query(`
  INSERT INTO public.posts (title, description, posted_by_id, posted_at)
  VALUES ($1, $2, $3, NOW()::timestamp);
  `,[req.body.marketName, req.body.description, user_id], (err, sqlres) => {
    return res.redirect("/getmarkets"); 
  });  
});
app.get("/secondredirect", (req, res) => {
  return res.redirect(301, "http://localhost:3000/second");
})
app.get("/second", (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, "./dist/secondpage.html"));
})

app.get("/", (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, "./dist/login.html"));
})

app.use((err, req, res, next) => {
  return res.status(418).send({"error": err});
})

http.listen(3000, () => console.log("server is listening on port 3000"));