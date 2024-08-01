const mongoose = require('mongoose');

const schema = mongoose.Schema;

const urlSchema = new schema({
  shortId : {
    type : String,
    required : true,
    unique : true
  },
  longUrl : {
    type : String,
    required : true
  },
  createdOn : {
    type : Date,
    required : true,
    default: Date.now
  },
  createdBy : {
    type : String,
    required : false
  },
  removed : {
    type : Boolean,
    required : true,
    default: false 
  }
});

const urlModel = mongoose.model('url', urlSchema);

module.exports = urlModel;
