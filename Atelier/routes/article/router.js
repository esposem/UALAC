/** @module artists/router */
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
router.all('/', middleware.supportedMethods('GET, POST, OPTIONS'));

//list artists
router.get('/', function(req, res, next) {

  Article.find({} , fieldsFilter).lean().exec(function(err, artists){
    if (err) return next (err);

    artists.forEach(function(artist){
      addLinks(artist);
    });
    res.json(artists);
  });
});

//create new artist
router.post('/', function(req, res, next) {
  console.log("CIAOCIAO");
    // const newArtist = new Article(req.body);
    // newArtist.save(onModelSave(res, 201, true));
});

//get a artist
router.get('/:artistid', function(req, res, next) {
  Article.findById(req.params.artistid, fieldsFilter).lean().exec(function(err, artist){
    if (err) return next (err);
    if (!artist) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    addLinks(artist);
    res.json(artist);
  });
});

//update a artist
router.put('/:artistid', function(req, res, next) {
  const data = req.body;

  Article.findById(req.params.artistid, fieldsFilter, function(err, artist){
    if (err) return next (err);
    if (artist){
      artist.name = data.name;
      artist.genre = data.genre;
      artist.artwork = data.artwork;
      artist.dateCreated = data.dateCreated;

      artist.save(onModelSave(res));
    }else{
      //artist does not exist create it
      const newArtist = new Article(data);
      newArtist._id = ObjectId(req.params.artistid);
      newArtist.save(onModelSave(res, 201, true));
    }
  });
});

//remove a artist
router.delete('/:artistid', function(req, res, next) {
  Article.findById(req.params.artistid, fieldsFilter, function(err, artist){
    if (err) return next (err);
    if (!artist) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    artist.remove(function(err, removed){
      if (err) return next (err);
      res.status(204).end();
      pubsub.emit('artist.deleted', {})
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

    pubsub.emit('artist.updated', {})
    if( sendItAsResponse){
      const obj = saved.toObject();
      delete obj.password;
      delete obj.__v;
      addLinks(obj);
      return res.status(statusCode).json(obj);
    }else{
      return res.status(statusCode).end();
    }
  }
}

function addLinks(artist){
  artist.links = [
    {
      "rel" : "self",
      "href" : config.url + "/artists/" + artist._id
    }
  ];
}

/** router for /artists */
module.exports = router;
