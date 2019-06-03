var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dt = new Date();
var dt = dt.toUTCString();

var temperatureSchema = new Schema({
	id: {type: Number, required: true, unique: true, default: 0},
    temperature: {type: Number, default: 0},
    date: {type: Date, default: dt},
    geyser: {type: Schema.Types.ObjectId, ref:'Geyser'}
});

module.exports = mongoose.model('Temperature', temperatureSchema);
