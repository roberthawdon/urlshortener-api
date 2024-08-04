const mongoose = require('mongoose');

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
  MONGO_REPLICASET
} = process.env;

const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
};

let url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

if (MONGO_REPLICASET) {
  url += `&replicaSet=${MONGO_REPLICASET}`
}

console.log('MongoDB Connection URL:', url);

mongoose.connect(url, options).then( function() {
  console.log('MongoDB is connected');
})
  .catch( function(err) {
  console.error('MongoDB connection error:', err);
});
