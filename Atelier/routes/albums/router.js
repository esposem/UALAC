/** @module albums/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Album = mongoose.model('Album');
const config = require("../../config");
const pubsub = require('../../pubsub');

//fields we don't want to show to the client
const fieldsFilter = { '__v': 0 };

//supported methods
router.all('/:albumid', middleware.supportedMethods('GET, PUT, DELETE, OPTIONS'));
router.all('/', middleware.supportedMethods('GET, POST, OPTIONS'));

//list albums
router.get('/', function(req, res, next) {

  Album.find({}, fieldsFilter).lean().populate('artist').exec(function(err, albums){
    if (err) return next (err);
    albums.forEach(function(album){
      addLinks(album);
    });
    res.json(albums);
  });
});

//create new album
router.post('/', function(req, res, next) {
    const newAlbum = new Album(req.body);
    newAlbum.save(onModelSave(res, 201, true));
});

//get a album
router.get('/:albumid', function(req, res, next) {
  Album.findById(req.params.albumid, fieldsFilter).lean().populate('artist').exec(function(err, album){
    if (err) return next (err);
    if (!album) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    addLinks(album);
    res.json(album);
  });
});

//update a album
router.put('/:albumid', function(req, res, next) {
  const data = req.body;

  Album.findById(req.params.albumid, fieldsFilter , function(err, album){
    if (err) return next (err);
    if (album){
      album.name =  data.name; 
      album.artist = data.artist;
      album.artwork = data.artwork;
      album.dateCreated = data.dateCreated;
      album.artwork = data.artwork;

      album.save(onModelSave(res));
    }else{
      //album does not exist create it
      const newAlbum = new Album(data);
      newAlbum._id = ObjectId(req.params.albumid);
      newAlbum.save(onModelSave(res, 201, true));
    }
  });
});

//remove a album
router.delete('/:albumid', function(req, res, next) {
  Album.findById(req.params.albumid, fieldsFilter , function(err, album){
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

function addLinks(album){
  album.links = [
    { 
      "rel" : "self",
      "href" : config.url + "/albums/" + album._id
    },
    { 
      "rel" : "artist",
      "href" : config.url + "/artists/" + album.artist
    }
  ];
}

/** router for /albums */
module.exports = router;
