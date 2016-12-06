/** @module users/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = mongoose.model('User');
const config = require("../../config");

//fields we don't want to show to the client
const fieldsFilter = { 'password': 0, '__v': 0 };

//supported methods
router.all('/:userid/playlists', middleware.supportedMethods('GET, PUT, OPTIONS'));
router.all('/:userid', middleware.supportedMethods('GET, PUT, DELETE, OPTIONS'));
router.all('/', middleware.supportedMethods('GET, POST, OPTIONS'));

//list users
router.get('/', function(req, res, next) {

  User.find({}, fieldsFilter).lean().exec(function(err, users){
    if (err) return next (err);
    users.forEach(function(user){
      addLinks(user);
    });
    res.json(users);
  });
});

//create new user
router.post('/', function(req, res, next) {

    const newUser = new User(req.body);
    newUser.save(onModelSave(res, 201, true));
});

//get a user
router.get('/:userid', function(req, res, next) {
  User.findById(req.params.userid, fieldsFilter).lean().exec(function(err, user){
    if (err) return next (err);
    if (!user) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    addLinks(user);
    res.json(user);
  });
});

//update a user
router.put('/:userid', function(req, res, next) {
  const data = req.body;

  User.findById(req.params.userid, fieldsFilter , function(err, user){
    if (err) return next (err);
    if (user){
      user.userName = data.userName;
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.email = data.email;
      user.playlists = data.playlists;

      user.save(onModelSave(res));
    }else{
      //user does not exist create it
      const newUser = new User(data);
      newUser._id = ObjectId(req.params.userid);
      newUser.save(onModelSave(res, 201, true));
    }
  });
});

//remove a user
router.delete('/:userid', function(req, res, next) {
  User.findById(req.params.userid, fieldsFilter , function(err, user){
    if (err) return next (err);
    if (!user) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    user.remove(function(err, removed){
      if (err) return next (err);
      res.status(204).end();
    })
  });
});

//get a user's playlists
router.get('/:userid/playlists', function(req, res, next) {
  const options = {
      path: 'playlists.tracks',
      model: 'Track'
    };

    const options2 = {
      path: 'playlists.tracks.artist',
      model: 'Artist'
    };

    const options3 = {
      path: 'playlists.tracks.album',
      model: 'Album'
    };

  User.findById(req.params.userid, fieldsFilter)
    .populate(options)
    .lean()
    .exec(function(err, user){
      if (err) return next (err);
      if (!user) {
        res.status(404);
        res.json({
          statusCode: 404,
          message: "Not Found"
        });
        return;
      }
      User.populate(user, options2, function(err, user){
        User.populate(user, options3, function(err, user){
          res.json(user.playlists);
        })
      })
    });
});

//update a user's playlists
router.put('/:userid/playlists', function(req, res, next) {
  const data = req.body;

  User.findById(req.params.userid, fieldsFilter , function(err, user){
    if (err) return next (err);
    if (!user) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    user.playlists = req.body;
    user.save(onModelSave(res));
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
    if( sendItAsResponse){
      const obj = saved.toObject();
      delete obj.password;
      delete obj.__v;
      addLinks(obj);
      res.status(statusCode)
      return res.json(obj);
    }else{
      return res.status(statusCode).end();
    }
  }
}

function addLinks(user){
  user.links = [
    { 
      "rel" : "self",
      "href" : config.url + "/users/" + user._id
    },
    { 
      "rel" : "playlists",
      "href" : config.url + "/users/" + user._id + "/playlists"
    }
  ];
}

/** router for /users */
module.exports = router;
