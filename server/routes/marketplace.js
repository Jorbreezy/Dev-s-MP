const express = require('express');
const fs = require('fs');
const router = express.Router();
const db = require("./models/models.js")
//ROUTES

router.get("/getJobs", (req, res, next) => {
  db.query(`
  SELECT * 
  FROM public.jobs
  `, (err, sqlres) => {
    if (err) {
      return next(err);
    }
    else {
      return res.status(200).send(sqlres.rows);
    }
  })  
});

router.post("/addJob", (req, res, next) => {
  const { created_by, job_title, job_description } = req.body;
  if (created_by === undefined || job_title === undefined || job_description === undefined) {
    return next("Invalid request body");
  }
  if (created_by === "" || job_title === "" || job_description === "") {
    return next("Missing Fields");
  }
  else {
    db.query(`
    INSERT INTO public.jobs (created_by, job_title, job_description, created_at)
    VALUES 
      ($1, $2, $3, NOW()::timestamp);
    `, [created_by, job_title, job_description], (err, sqlres) => {
      if (err) {
        return next(err);
      }
      else {
        return res.status(200).send({"message": "job posted"});
      }
    })
  }
});



module.exports = router;