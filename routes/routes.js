const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const urlModel = require('../model/urlModel');
const setting = require('../settings');

const router = express.Router();

const jwtSecret = process.env.API_JWT_SECRET || setting.value.api.jwtSecret
const tokenExpiry = process.env.API_TOKEN_EXPIRY || setting.value.api.tokenExpiry

router.post('/signup', passport.authenticate('signup', { session : false }), async (req, res, next) => {
  res.json({
    message : 'Signup successful',
    user : req.user
  });
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if(err || !user){
        const error = new Error('An Error occurred');
        return next(error);
      }
      req.login(user, { session : false }, async (error) => {
        if( error )  return next (error)
        const body = { _id : user._id, email : user.email };
        const token = jwt.sign({ user : body }, jwtSecret, { expiresIn: tokenExpiry } );
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get('/lookup/:urlCode', async (req, res, next) => {
  try {
    const result = await urlModel.findOne({ shortId: req.params.urlCode }).exec();
    if (!result) {
      res.status(404).json({ request: req.params.urlCode, error: "Short ID Not Found" });
    } else {
      const longUrl = result.longUrl;
      res.json({ request: req.params.urlCode, longUrl: longUrl });
    }
  } catch (error) {
    const err = new Error('An Error occurred');
    next(err);
  }
});

module.exports = router;
