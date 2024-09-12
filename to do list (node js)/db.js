// connect to mongodb
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/to-do-list';
let db;

module.exports = {
    connect: async (cb) => {
        MongoClient.connect(url)
            .then((client) => {
                console.log('Connected to MongoDB');
                db = client.db();
                return cb();
            })
            .catch((err) => {
                console.error('Error connecting to MongoDB', err);
                return cb(err);
            });
    },
    getDB: () => {
        return db;
    }
}