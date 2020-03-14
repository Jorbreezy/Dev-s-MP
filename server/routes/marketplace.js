const express = require('express');
const fs = require('fs');
const router = express.Router();
const db = require("../models/model.js")
//ROUTES

router.get("/getJobs", (req, res, next) => {
  db.query(`
  SELECT * 
  FROM public.jobs as jobs
  ORDER BY jobs.created_at DESC;
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
    });
  }
});

router.delete("/removeJob", (req, res, next) => {
  const { post_id } = req.body;
  if (post_id === undefined || post_id === "") {
    return next("Invalid post id");
  }
  else {
    db.query(`
    DELETE FROM public.jobs
    WHERE public.jobs.post_id = $1
    `,[post_id], (err, sqlres) => {
      if (err) {
        return next(err);
      }
      else {
        return res.status(200).send({"message": `${post_id} removed`});
      }
    });
  }
});

module.exports = router;