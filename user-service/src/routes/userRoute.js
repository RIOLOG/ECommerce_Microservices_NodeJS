const express = require('express');
const {getAllProductInInventory, updateProductInInventory, 
    removeProductFromInventory, addProductToInventory, 
    getUserProductDetails, RegisterController, loginController, 
    getUserController, addToCart,
    removeFromCart, checkoutfromcart}  = require('../controllers/userController');

const authMiddleware = require("../middleware/authMiddleware")


const router = express.Router();


router.post("/register", RegisterController);
router.post("/login", loginController);


//for admin specific:
router.get("/getUser", authMiddleware, getUserController)



/////////////////////// Communication between Services //////////////////////////////////////////////////

//defining the route to get product details accessed from product-service:
router.get('/user-product-details/:productId', getUserProductDetails);


//defining the route to get all product details to inventory (user to product service):
router.get('/getall-product', getAllProductInInventory)


//defining the route to add product to inventory (user to product service):
router.post('/add-product',authMiddleware, addProductToInventory);


//defining the route to delete product to inventory (user to product service):
router.delete('/remove-product/:id',authMiddleware, removeProductFromInventory);


//defining the route to delete product to inventory (user to product service):
router.put('/update-product/:id',authMiddleware, updateProductInInventory);



//// Defining route to connect user service to cart service/////
router.post("/cart/add", addToCart);
router.delete("/cart/remove/:productId", removeFromCart);
router.post("/checkout/:id", checkoutfromcart);



module.exports = router;
