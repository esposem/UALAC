/** @module albums/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Article = mongoose.model('Article');
const config = require("../../config");
// const security= require("../security.js")

//fields we don't want to show to the client
const fieldsFilter = { '__v': 0 };

//supported methods
router.all('/:artistid', middleware.supportedMethods('GET, PUT, DELETE, OPTIONS'));
router.all('/', middleware.supportedMethods('GET, POST, PUT, DELETE, OPTIONS'));

//list albums
router.get('/', function(req, res, next) {

  Article.find({}, fieldsFilter).lean().populate('').exec(function(err, articles){
    if (err) return next (err);
    res.json(articles);
    // res.status(200);
    // res.send();
  });
});

//create new album
router.post('/', function(req, res, next) {
  console.log("POST ");
  if(req.body.image.length == 0){
    req.body.image = ['/images/blank-user.jpg']
  }
    const newArticle = new Article(req.body);
    newArticle.save();
    res.json(newArticle._id)
    // console.log(newArticle._id);
});


//get a album
router.get('/:articleid', function(req, res, next) {
  // console.log("Hope");
  Article.findById(req.params.articleid, fieldsFilter).lean().populate('').exec(function(err, article){
    if (err) return next (err);
    if (!article) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    res.json(article);
  });
});

//update a album
router.put('/', function(req, res, next) {
  const data = req.body;
  console.log("PUT " + req.body);

  Article.findById(req.body._id, fieldsFilter , function(err, article){
    if (err) return next (err);
    if (article){
      article.text =  data.text;
      article.image = data.image || "/images/blank-user.jpg";
      article.title = data.title;
      article.save();
      res.status(201);
      res.send();
    }
    else{
      // console.log("ERROR");
      // res.status(500);
      // res.send();
      const newArticle = new Article(req.body);
      newArticle.save();
      res.json(newArticle._id)
    }

  });
});



//remove a album
router.delete('/:articleid', function(req, res, next) {
  Article.findById(req.params.articleid, fieldsFilter , function(err, article){
    if (err) return next (err);
    if (!article) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    article.remove(function(err, removed){
      if (err) return next (err);
      res.status(204).end();
    })
  });
});


/** router for /albums */
module.exports = router;
