const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    avatar:{
        type: String
    },
    password:{
        type: String,
        required:true,
        minlength:6
    },
    date:{
        type: Date,
        default: Date.now
    }

});
module.exports = User = mongoose.model('user',userSchema);