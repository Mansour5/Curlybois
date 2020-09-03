const mongoose = require('mongoose');
const Schema = mongoose.Schema

let pageSchema = new Schema({
  content: String
})

mongoose.model('pages', pageSchema);
