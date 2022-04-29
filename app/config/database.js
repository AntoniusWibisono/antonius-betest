const mongoose = require('mongoose');
const redis = require('redis');
const { promisify } = require('util');

const DB_NAME = 'db_antonius_betest';
const DB_URL = `mongodb://localhost:27017/${DB_NAME}`;
const HOST_REDIS = 'redis1';
const PORT_REDIS = '6379';

const mongoDb = () => {
  mongoose.connect(DB_URL);
  const db = mongoose.connection;
  db.on('error', (err) => {
    console.error(`error on mongoDB connection -> ${err}`);
    throw err;
  });
  db.once('open', () => console.log('mongoDB is connected'));

  return db;
};

const redisClient = () => {
  const redisConnect = redis.createClient({
    host: HOST_REDIS,
    port: PORT_REDIS,
    legacyMode: true
  });

  redisConnect.on('error', (err) => console.error(`error redis -> ${err}`));

  redisConnect.connect();

  return redisConnect;
};

const getAsync = promisify(redisClient().get).bind(redisClient);
const setAsync = promisify(redisClient().set).bind(redisClient);

module.exports = {
  mongoDb,
  getAsync,
  setAsync
  // redisDb,
};
