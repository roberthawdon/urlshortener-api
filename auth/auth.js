const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const JWTstrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;

const userModel = require('../model/userModel');
const setting = require('../settings');

const jwtSecret = process.env.API_JWT_SECRET || setting.value.api.jwtSecret

passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
    try {
      const user = await userModel.create({ email, password });
      return done(null, user);
    } catch (error) {
      done(error);
    }
}));

passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  try {
    const user = await userModel.findOne({ email });
    if ( !user ){
      console.log('Invalid user');
      return done(null, false, { message : 'Invalid user or password' });
    }
    const validate = await user.isValidPassword(password);
    if ( !validate ){
      console.log('Invalid password');
      return done(null, false, { message : 'Invalid user or password' });
    }
    console.log('Logged in successfully');
    return done(null, user, { message : 'Logged in successfully' });
  } catch (error) {
    return done(error);
  }
}));

passport.use(new JWTstrategy({
  secretOrKey : jwtSecret,
  jwtFromRequest : extractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));

passport.use('changePassword', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
    try {
      filter = { email: email };
      update = { password: password};
      const user = await userModel.findOneAndUpdate(filter, update, {new: true});
      return done(null, user);
    } catch (error) {
      done(error);
    }
}));
