var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    postBody: {type: String, default: ''},
    likes:[{type: Schema.Types.ObjectId, ref: 'User'}],
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    comments: [{type: Schema.Types.ObjectId, ref:'Comment'}]},
 {timestamps: {'createdAt': 'createdAt', 'updatedAt': 'updatedAt'}})

module.exports = mongoose.model('Post', postSchema);