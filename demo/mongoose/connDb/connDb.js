const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.connect('mongodb://localhost/test');

db.on('error', () => {
	console.log('connection error!');
});
db.on('open', (cb) => {
	console.log('connection success!');
	typeof cb == 'function' && cb();
});

module.exports = db;