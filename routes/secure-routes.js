const express = require('express');
const validUrl = require('valid-url');
const passport = require('passport');

const urlModel = require('../model/urlModel');
const makeId = require('../functions/makeid');
const setting = require('../settings');

const router = express.Router();

const appHost = process.env.APP_HOST || setting.value.appSettings.host;
const appUri = process.env.APP_URI || setting.value.appSettings.uri;

router.get('/profile', (req, res, next) => {
  res.json({
    message : 'You made it to the secure route',
    user : req.user,
    token : req.query.secret_token
  })
});

router.post('/user', passport.authenticate('signup', { session : false }), async (req, res, next) => {
  res.json({
    message : 'Signup successful',
    user : req.user
  });
});

router.patch('/user', passport.authenticate('changePassword', { session : false }), async (req, res, next) => {
  res.json({
    message : 'Password update successful',
    user : req.user
  });
});

router.post('/new', (req, res, next) => {
  if (validUrl.isUri(req.body.longUrl)){
    var shortId = makeId(6);
    urlModel.create( { shortId: shortId, longUrl: req.body.longUrl, createdBy: req.user } );
    res.status(201).json({ status: 'Created', shortId: shortId, shortUrl: appHost + appUri + '/' + shortId });
  } else {
    res.status(400).json({ status: 'Bad Request', detail: 'Invalid URL format: ' + req.body.longUrl });
  };
});

router.get('/list', (req, res, next) => {
  return urlModel.find({ createdBy: req.user },function(err,result){
    try {
      if (!result){
        res.status(404).json({ error: "No entries found"});
      } else if (err) {
        const error = new Error('An Error occurred');
        return next(error);
      } else {
        var o = {};
        var key = 'entries';
        o[key] = [];
        for (var index in result){
          console.log(index+": "+result[index]);
          var d = {
            shortId: result[index].shortId,
            longUrl: result[index].longUrl,
            createdOn: result[index].createdOn,
            removed: result[index].removed
          };
          o[key].push(d);
        }
        res.json( o );
      };
      return result;
    } catch (error) {
      return next(error);
    };
  });
});

module.exports = router;
