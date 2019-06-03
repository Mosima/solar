var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstname: { type: String, default: '' },
    middldename: { type: String, default: '' },
    displayName: {type: String},
    googleId: {type: String},
    facebookId: {type: String},
    lastname: { type: String, default: '' },
    address1: { type: String, default: '' },
    address2: { type: String, default: '' },
    address: { type: String, default: '' },
    gender: {type: String, enum: ['male', 'female']},
    suburb: { type: String, default: '' },
    district: {type: String, default: ''},
    city: { type: String, default: '' },
    province: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    dateOfBirth: { type: Date, default: '' },
    cell1: { type: String, default: '' },
    cell2: { type: String, default: '' },
    email: { type: String },
    password: String,
    profile: {},
    isGlobalAdmin: {type: Boolean, default: false},
    role: { type: String, enum: ['user', 'manager'], default: 'user' },
    status: { type: String, default: '' },
    picture: { type: String, default: 'http://images.clipartpanda.com/user-clipart-xigojzxKT.png' },
    geyser:[{ type: Schema.Types.ObjectId, ref:'Geyser'}]
});

userSchema.pre('save', function(next) {

    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });

    });
});


userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.index({email: 'text'});


module.exports = mongoose.model('User', userSchema);
