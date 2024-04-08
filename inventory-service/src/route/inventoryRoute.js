const express = require('express');
const router = express.Router();
const {
    addProductToInventory,
    updateProductQuantity,
    getInventory,getProductQuantity, removeProductQuantity
} = require('../controller/inventoryController');



router.post('/add', async (req, res) => {
    try 
    {
        const { productId, quantity } = req.body;
        const inventory = await addProductToInventory(productId, quantity);
        res.status(201).json({ success: true, inventory });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: error.message });
    }
});

// router.put('/update/:productId', async (req, res) => {
//     try 
//     {

//         const { productId } = req.params;
//         const { quantity } = req.body;
//         const inventory = await updateProductQuantity(productId, quantity);
//         res.json({ success: true, inventory });
//     } 
//     catch (error) 
//     {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

router.get('/getproduct', async (req, res) => {
    try 
    {
        const inventory = await getInventory();
        res.json({ success: true, inventory });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/get-quantity/:id", getProductQuantity);

router.post("/remove-quantity", removeProductQuantity);




module.exports = router;
