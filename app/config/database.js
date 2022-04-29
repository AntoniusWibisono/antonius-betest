const mongoose = require('mongoose');
const redis = require('redis');

const DB_NAME = 'db_antonius_betest';
const DB_URL = `mongodb://localhost:27017/${DB_NAME}`
const HOST_REDIS = 'cache';
const PORT_REDIS = '6379'

const mongoDb = () => {
    mongoose.connect(DB_URL);
    const db = mongoose.connection;
    db.on('error', (err) => {
        console.error(`error on mongoDB connection -> ${err}`);
        throw err;
    })
    db.once('open', () => console.log('database is connected'));

    return db;
}

const redisDb = () => {
    const redisConnect = redis.createClient({
        host: HOST_REDIS,
        port: PORT_REDIS
    });

    redisConnect.on('error', (err) => console.error(`error redis -> ${err}`));

    return redisConnect;
}

module.exports = {
    mongoDb,
    redisDb,
}