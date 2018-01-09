const mongoose = require('mongoose');
const Schema = mongoose.schema;
const Objectid = mongoose.types.objectid;

const db = require('./connDb/connDb.js');

const blogSchema = new Schema({
	title: String,
	author: {type: String, default: 'vins'},
	hidden: Boolean,
	date: {type: Date, default: Date.now()},
	meta: {votes: Number, favs: Number}
});
blogSchema.methods.findByTitle = function (option, cb) {
	return this.model('Blog').find({'title': option.title}, cb);
} 

var Blog = mongoose.model('Blog', blogSchema);

