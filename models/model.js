const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    //empId:{
       // type: Number,
      //  unique: true
   // },
    dep:{
        type: String,
        required: true
    },
    phnNo:{
        type: Number,
        required: true
    },
    dob:{
        type: Date,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    empId:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    login:{
        type: [Date],
        required: true
    },
    logoff:{
        type: [Date],
        required: true
    },
    wage:{
        type: Number,
        required: true
    },
    token:{
        type:String
    }
})

module.exports = mongoose.model('user',UserSchema);