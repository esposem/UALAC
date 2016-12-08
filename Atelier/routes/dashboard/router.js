/** @module albums/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Article = mongoose.model('Article');
const config = require("../../config");
const pubsub = require('../../pubsub');

//fields we don't want to show to the client
const fieldsFilter = { '__v': 0 };

//supported methods
router.all('/:artistid', middleware.supportedMethods('GET, PUT, DELETE, OPTIONS'));
router.all('/', middleware.supportedMethods('GET, POST, PUT, OPTIONS'));

//list albums
router.get('/', function(req, res, next) {
  console.log("CALLED");
  Article.find({}, fieldsFilter).lean().populate('').exec(function(err, articles){
    if (err) return next (err);
    res.json(articles);
    res.status(200);
    res.send();
  });
});

//create new album
router.post('/', function(req, res, next) {
  console.log("dashboard");
  console.log(req.body);
    const newArticle = new Article(req.body);
    newArticle.save();
    res.json(newArticle._id)
    // console.log(newArticle._id);
    res.status(201);
    res.send();
});


//get a album
router.get('/:artistid', function(req, res, next) {
  Article.findById(req.params.artistid, fieldsFilter).lean().populate('').exec(function(err, artist){
    if (err) return next (err);
    if (!artist) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    res.json(artist);
  });
});

//update a album
router.put('/', function(req, res, next) {
  const data = req.body;

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
      console.log("ERROR");
      res.status(500);
      res.send();
    }

  });
});

//remove a album
router.delete('/:albumid', function(req, res, next) {
  Article.findById(req.params.albumid, fieldsFilter , function(err, album){
    if (err) return next (err);
    if (!album) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    album.remove(function(err, removed){
      if (err) return next (err);
      res.status(204).end();
      pubsub.emit('album.deleted', {})
    })
  });
});

function onModelSave(res, status, sendItAsResponse){
  const statusCode = status || 204;
  sendItAsResponse = sendItAsResponse || false;
  return function(err, saved){
    if (err) {
      if (err.name === 'ValidationError'
        || err.name === 'TypeError' ) {
        res.status(400)
        return res.json({
          statusCode: 400,
          message: "Bad Request"
        });
      }else{
        return next (err);
      }
    }

    pubsub.emit('album.updated', {})
    // if( sendItAsResponse){
    //   const obj = saved.toObject();
    //   delete obj.password;
    //   delete obj.__v;
    //   // addLinks(obj);
    //   return res.status(statusCode).json(obj);
    // }else{
    //   return res.status(statusCode).end();
    // }
  }
}


/** router for /albums */
module.exports = router;
