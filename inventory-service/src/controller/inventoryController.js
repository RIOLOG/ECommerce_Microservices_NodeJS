const Inventory = require('../models/Inventory');


const addProductToInventory = async (productId, quantity) => {
    try {
        let inventory = await Inventory.findOne({ productId });
        if (!inventory)
         {
            //console.log(quantity);
            inventory = new Inventory({ productId, qunatity: quantity });
            //console.log(inventory);
        } 
        else
        {
            // Update the quantity by adding the new quantity to the existing one
            inventory.qunatity += quantity;
        }
        await inventory.save();
        return inventory;
    } 
    catch (error) 
    {
        throw new Error(error.message);
    }
};


const getProductQuantity = async (req, res) => {
    try 
    {
        const productId = req.params.id;
        const inventory = await Inventory.findOne({ productId });
        if (!inventory) {
            throw new Error("Product not found in inventory");
        }
        return res.status(200).json({ success: true, quantity: inventory.qunatity });
    } 
    catch (error) 
    {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const removeProductQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let inventory = await Inventory.findOne({ productId });
        if (!inventory) {
            throw new Error("Product not found in inventory");
        }
        inventory.qunatity -= quantity;
        await inventory.save();
        return res.status(200).json({ success: true, inventory });
    } 
    catch (error) 
    {
        return res.status(500).json({ success: false, message: error.message });
    }
};





const updateProductQuantity = async (productId, quantity) => {
    try 
    {
        let inventory = await Inventory.findOne({ productId });
        if (!inventory) 
        {
            throw new Error('Inventory not found');
        }
        inventory.qunatity = quantity;
        await inventory.save();
        return inventory;
    } 
    catch (error) 
    {
        throw new Error(error.message);
    }
};

const getInventory = async () => {
    try 
    {
        const inventory = await Inventory.find();
        return inventory;
    } 
    catch (error) 
    {
        throw new Error(error.message);
    }
};

module.exports = { addProductToInventory, updateProductQuantity, 
    getInventory, removeProductQuantity, getProductQuantity};
