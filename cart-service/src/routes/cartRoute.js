const express = require('express');
const {getCartByUserId, addToCart, removeFromCart, checkoutfromcart} = require('../controllers/cartController')


const router = express.Router();


///routes:

router.post('/add-to-cart', addToCart);
router.get('/get-cart/:id', getCartByUserId);

router.delete('/remove/:productId', removeFromCart);
router.post("/checkout/:userId", checkoutfromcart);



module.exports = router;