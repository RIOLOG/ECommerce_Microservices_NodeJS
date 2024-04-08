const express = require('express');
const {getProductDetailsFromInventory, getProductDetails, getAllProducts, getProductById, createProductController, deleteProductController, productUpdateController} = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


//defining all routes:
router.get("/getall", getAllProducts);
router.get("/get/:id", getProductById);
router.post("/create",  createProductController);
router.put("/update/:id", productUpdateController);
router.delete('/delete/:id',  deleteProductController);


/////////////////////// Communication between Services //////////////////////////////////////////////////

//defining route to get accessed from user service:
router.get("/product-details/:productId",  getProductDetails);


//defining to fetch product details from inventory service:
router.get('/product-details-inventory/:productId', getProductDetailsFromInventory);



module.exports = router