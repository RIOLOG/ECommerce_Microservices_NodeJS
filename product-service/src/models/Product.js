const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    size:{
        type:String
    },
    design:
    {
        type:String
    },
    quantity:{
        type:Number
    }
})

module.exports = mongoose.model('Product', productSchema);