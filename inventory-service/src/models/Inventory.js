const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },

    qunatity:{
        type:Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Inventory', inventorySchema);

