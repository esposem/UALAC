/** @module albums/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Article = mongoose.model('Article');
const config = require("../../config");
const fs = require('fs');
const JSZip = require("jszip");
const URL = require('url');

//fields we don't want to show to the client
const fieldsFilter = { '__v': 0 };

//supported methods
router.all('/:id', middleware.supportedMethods('GET, POST, DELETE'));
router.all('/', middleware.supportedMethods('GET, POST, DELETE'));

router.post('/', function(req, res, next) {
  let imgarr = req.body.images;
  // imgarr.forEach(function(el){
  //   el = "./app/" + el;
  //   console.log(el);
  // })
  let filetoread = ['./app/elements/menu-item/menu-item.html', './app/elements/menu-component/menu-component.html',
  './app/elements/article-item/article-item.html', './app/elements/switch-view/switch-view.html',
  './app/elements/image-component/image-component.html'];
  let subfiletoread = ['./app/elements/article/the-temp.html']
  let subsubtoread = ['./app/elements/article/Template_files/cssppms100mm_luganolac_1815911_16415_1.png',	'./app/elements/article/Template_files/ico_text_plus.png',
  './app/elements/article/Template_files/datepicker.css'	,				'./app/elements/article/Template_files/ico_tickets.png',
  './app/elements/article/Template_files/ico_facebook.png'	,			'./app/elements/article/Template_files/ico_twitter.png',
  './app/elements/article/Template_files/ico_fb.png'	,				'./app/elements/article/Template_files/impulse1.jpg',
  './app/elements/article/Template_files/ico_gallery.png'			,		'./app/elements/article/Template_files/impulse2.jpg',
  './app/elements/article/Template_files/ico_googleplus.png',				'./app/elements/article/Template_files/lac_logo_16.png',
  './app/elements/article/Template_files/ico_home.png'		,			'./app/elements/article/Template_files/lac_logo_w.png',
  './app/elements/article/Template_files/ico_linkedin.png'	,			'./app/elements/article/Template_files/lcal8517315151647_1.png',
  './app/elements/article/Template_files/ico_mail.png',					'./app/elements/article/Template_files/lcal851731516021_1.png',
  './app/elements/article/Template_files/ico_pinterest.png',				'./app/elements/article/Template_files/menu_mobile.png',
  './app/elements/article/Template_files/ico_search.png'	,				'./app/elements/article/Template_files/styles.lac.3.css',
  './app/elements/article/Template_files/ico_share.png'		,			'./app/elements/article/Template_files/styles.mediaHeight.css',
  './app/elements/article/Template_files/ico_text_1.png'	,				'./app/elements/article/Template_files/styles.phone.css',
  './app/elements/article/Template_files/ico_text_2.png'	,				'./app/elements/article/Template_files/styles.tablet.landscape.css',
  './app/elements/article/Template_files/ico_text_3.png'	,				'./app/elements/article/Template_files/styles.tablet.portrait.css',
  './app/elements/article/Template_files/ico_text_min.png',				'./app/elements/article/Template_files/vuoto.gif']
  let stylesel = ['./app/styles/app-theme.html','./app/styles/shared-styles.html']
  let cssel = ['./app/css/app.css','./app/css/standardize.css']
  let zip = new JSZip();
  let folder = zip.folder("export");
  let appf = folder.folder("app");
  let elements = appf.folder("elements");
  let styles = appf.folder("styles");
  let css = appf.folder("css");
  let images = appf.folder("images");
  let article = elements.folder("article");
  let templ_file = article.folder("Template_files");

  imgarr.forEach(function(el){
    let contentPromise9 = new JSZip.external.Promise(function (resolve, reject) {
        fs.readFile("./app/" + el, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    let name = el.split('/')
    images.file(name[name.length -1], contentPromise9);
  })

  stylesel.forEach(function(el){
    let contentPromise8 = new JSZip.external.Promise(function (resolve, reject) {
        fs.readFile(el, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    let name = el.split('/')
    styles.file(name[name.length -1], contentPromise8);
  });

  cssel.forEach(function(el){
    let contentPromise8 = new JSZip.external.Promise(function (resolve, reject) {
        fs.readFile(el, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    let name = el.split('/')
    css.file(name[name.length -1], contentPromise8);
  });

  filetoread.forEach(function(el){
    let contentPromise = new JSZip.external.Promise(function (resolve, reject) {
        fs.readFile(el, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    let name = el.split('/')
    let temp = elements.folder(name[name.length -1].split('.')[0])
    temp.file(name[name.length -1], contentPromise);
  });

  let contentPromise2 = new JSZip.external.Promise(function (resolve, reject) {
      fs.readFile(subfiletoread[0], function(err, data) {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
  let name2 = subfiletoread[0].split('/');
  article.file(name2[name2.length -1], contentPromise2);

  let contentPromise4 = new JSZip.external.Promise(function (resolve, reject) {
      fs.readFile('./bower.json', function(err, data) {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
  let name4 = './bower.json'.split('/');
  appf.file(name4[name4.length -1], contentPromise4);


  subsubtoread.forEach(function(el){
    let contentPromise3 = new JSZip.external.Promise(function (resolve, reject) {
        fs.readFile(el, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    let name3 = el.split('/');
    templ_file.file(name3[name3.length -1], contentPromise3);
  });

  appf.file("login.html", "<html>  \n "+
    "<head>  \n " +
      "<title>  \n " +
      "  Export  \n " +
      "</title> \n " +
      "<script src=\"/bower_components/webcomponentsjs/webcomponents-lite.js\"></script> \n " +
      "<script> window.Polymer = window.Polymer || {}; window.Polymer.dom = 'shadow'; </script> \n " +
      "<link rel=\"stylesheet\" href=\"./css/standardize.css\">  \n " +
      "<link rel=\"stylesheet\" href=\"./css/app.css\"> \n " +
      "<!-- This file contains theming for your app --> \n " +
      "<link rel=\"import\" href=\"./styles/app-theme.html\"> \n " +
      "<!-- shared styles for all modules --> \n " +
      "<link rel=\"import\" href=\"./styles/shared-styles.html\"> \n " +
      "<style is=\"custom-style\" include=\"shared-styles\"></style> \n " +
      "<link rel=\"import\" href=\"./elements/article/the-temp.html\"> \n " +
    "</head>  \n "+
    "<body> \n " +
    `<the-temp  \n text=\"false\" >  \n`  + req.body.text  + `\n</the-temp>` +
    "</body> \n " +
  "</html> \n ");

  appf.file("how_to_run.txt", " With terminal, go in /app and then write `bower install`. After all the files are created \n" +
  "run polyserve. The result will be in localhost:8080.");

  zip
  .generateNodeStream({type:'nodebuffer',streamFiles:true})
  .pipe(fs.createWriteStream('./output/out.zip'))
  .on('finish', function () {
    console.log("out.zip written.");
    res.sendStatus(201);
    res.end();
  });
});


router.delete('/', function(req,res, next){
  let name = req.body.name;
  fs.unlink('./app/images/' + name, (err) => {
  if (err) throw err;
  // console.log('successfully deleted !');
  res.sendStatus(204);
  });
});




module.exports = router;
