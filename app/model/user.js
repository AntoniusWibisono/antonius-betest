const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName:{
        type: String,
        unique:true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    accountNumber:{
        type: Number,
        unique:true,
        required: true
    },
    emailAddress:{ 
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
      },
    identityNumber:{
        type:Number,
        required:true,
        unique:true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;