/** @module models/Album
* The Album Model.
* Schema:
* _id            String       required   Unique identifier of the album
* name           String       required   Name of the album
* artist         ObjectId     required   Artist who performs in this album. It should be the `_id` of an Artist model document.
* artwork        String       optional   URL of the artwork picture for the album. Default ''
* tracks         [ObjectId]   required   Tracks that this album contains. They should be `_id`s of Track Model documents.
* dateCreated    Date         required   Date the album was created. Default: Date.now()
* dateReleased   Date         required   Date the album was released. Default: Date.now()
* label          String       optional   Record label of this album. Default: 'USI-INF records'
*/


'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


/** @constructor
* @augments AbstractSoundCollectionSchemaInstance
* @param {Object} definition
*/
const ArticleSchema = new mongoose.Schema(
  {
    title : { type: String, required: true },
    image : { type: [String]},
    text : { type: String, default: "Nothing to show" },
    dateCreated : { type: Date, default: Date.now },
  }
);

//register model
mongoose.model('Article', ArticleSchema);
