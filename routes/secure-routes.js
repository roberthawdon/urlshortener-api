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

router.delete('/remove', async (req, res, next) => {
  try {
    const result = await urlModel.findOne({ shortId: req.body.shortId }).exec();
    if (!result) {
      res.status(404).json({ request: req.body.shortId, error: "Short ID Not Found" });
    } else if (result.removed) {
      res.status(410).json({ request: req.body.shortId, error: "Short ID Gone" });
    } else {
      const updateResult = await urlModel.updateOne( {shortId: req.body.shortId}, {longUrl: null, removed: true});
      res.json({ request: req.body.shortId });
    }
  } catch (error) {
    const err = new Error('An Error occurred');
    next(err);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const result = await urlModel.find({ createdBy: req.user }).exec();
    if (!result || result.length === 0) {
      res.status(404).json({ error: "No entries found" });
    } else {
      const entries = result.map(entry => ({
        shortId: entry.shortId,
        longUrl: entry.longUrl,
        createdOn: entry.createdOn,
        removed: entry.removed
      }));
      res.json({ entries });
    }
  } catch (error) {
    next(new Error('An Error occurred'));
  }
});

module.exports = router;
