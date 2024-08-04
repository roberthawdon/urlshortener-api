const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const userModel = require('./model/userModel');

const setting = require('./settings');

const db = require('./db');

const port = process.env.PORT || setting.value.api.port;

require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

var appName = "URL Shortener API"
var version = "0.0.15"

app.use('/', routes);
app.use('/manage', passport.authenticate('jwt', {session : false}), secureRoute);

app.get('/ping', (req, res, next) => {
  res.status(200).json({ application: appName, version: version });
});

app.get('/lookup', (req, res) => {
  res.status(400).json({ error: "Bad Request"});
});

// app.put('/modify/:urlCode', (req, res) => {
//   console.log('Got body:', req.body);
//   res.sendStatus(200);
// });

app.all('*', function(req, res, next){
  res.status(404).json({ error: "Endpoint Not Found"});
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({ error: "Internal Server Error"});
})

app.listen(port, () => {
  console.log("Server started and listening on port " + port)
});

