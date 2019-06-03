var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geyserSchema = new Schema({
    name: {type: String, default: ''},
    temp:{type: Schema.Types.ObjectId, ref: 'Temperature'},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    waterLevel: {type: Schema.Types.ObjectId, ref:'Water'}},
    {timestamps: {'createdAt': 'createdAt', 'updatedAt': 'updatedAt'}})

module.exports = mongoose.model('Geyser', geyserSchema);