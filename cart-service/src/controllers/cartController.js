const cartModel = require('../models/cartModel');
const axios = require('axios');


// const addToCart = async (req, res) => {
//     const { userId, productId, quantity } = req.body;

//     try 
//     {
//         let cart = await cartModel.findOne({ userId });
//         //console.log("Existing Cart:", cart);

//         if (!cart) 
//         {
//             cart = new cartModel({ userId, products: [] }); 
//         }

//         const existingProductIndex = cart.products.findIndex(item => item.productId === productId);

//         if (existingProductIndex !== -1) {
//             cart.products[existingProductIndex].quantity += quantity;
//         } 
//         else 
//         {
//             cart.products.push({ productId, quantity });
//         }

//         await cart.save();

//         //console.log("Updated Cart:", cart);

//         res.status(200).send({
//             success: true,
//             message: 'Product added to cart successfully',
//             cart
//         });
//     } 
//     catch (err) 
//     {
//         console.error("Error in addToCart:", err);
//         res.status(500).send({
//             success: false,
//             message: "Error in cart add api",
//             err
//         });
//     }
// };



const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try 
    {
        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            cart = new cartModel({ userId, products: [] }); 
        }

        const existingProduct = cart.products.find(item => item.productId === productId);

        if (existingProduct) {
            // If the product already exists in the cart, update its quantity
            existingProduct.quantity += quantity;
        } else {
            // If the product is not in the cart, add it
            cart.products.push({ productId, quantity });
        }

        // Save the updated cart
        await cart.save();

        res.status(200).send({
            success: true,
            message: 'Product added to cart successfully',
            cart
        });
    } 
    catch (err) 
    {
        console.error("Error in addToCart:", err);
        res.status(500).send({
            success: false,
            message: "Error in cart add api",
            err
        });
    }
};






// const getCartByUserId = async(req, res) => {
//     const userId = req.params.id;
//     console.log("get card userid se ", req.params.id);
//     //console.log(userId);

//     try 
//     {
//         const cart = await cartModel.findOne({ userId }).populate('products.productId', 'name price');

//         if (!cart)
//          {
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         res.status(200).json({ cart });
//     } 
//     catch (err) 
//     {
//         console.log("cart catch error");
//         res.status(400).json({ message: err.message });
//     }
// };



const getCartByUserId = async (req, res) => {
    const userId = req.params.id;

    try 
    {
        const cart = await cartModel.findOne({ userId }).populate('products.productId', 'name price');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    } 
    catch (err) {
        console.log("Error in getCartByUserId:", err);
        res.status(500).json({ message: err.message });
    }
};



// const removeFromCart = async (req, res) => {
//     try 
//     {
//         const { productId, userId } = req.params;


//         const cart = await cartModel.findOne({ userId });

//         if (!cart) 
//         {
//             return res.status(404).json({ success: false, message: "Cart not found for the user" });
//         }

//         cart.items = cart.items.filter(item => item.productId !== productId);

//         await cart.save();
//         res.status(200).json({ success: true, message: "Item removed from cart successfully" });
//     } 
//     catch (error) 
//     {
//         console.error("Error in removeFromCart:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };



const removeFromCart = async (req, res) => {
    try {
        const { productId, userId } = req.params;

        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found for the user" });
        }

        cart.products = cart.products.filter(item => item.productId.toString() !== productId);

        await cart.save();
        res.status(200).json({ success: true, message: "Item removed from cart successfully" });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};




const checkoutfromcart = async (req, res) => {
    try 
    {
        const { userId } = req.params;
        //console.log(userId)

        const cart = await cartModel.findOne({ userId });

        //console.log(cart);
        //console.log("Total quantity in the cart:", cart.products.reduce((total, product) => total + product.quantity, 0));
        //console.log("Product ID:", cart.products[0].productId);

        if (!cart) 
        {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        if (!cart.products || cart.products.length === 0) 
        {
            return res.status(404).json({ success: false, message: "Cart is empty" });
        }

        // //function we need to verify before checkout:
        // let initalQuantity = cart.products.reduce((total, product) => total + product.quantity, 0);
        // var pid = cart.products[0].productId;

        // //console.log(initalQuantity);
        // //console.log(pid);

        // let itemQuantityinCart = await axios.get(`http://localhost:8082/api/inventory/get-quantity/${pid}`);
        // const Originalquantity = itemQuantityinCart.data.quantity;
        // //console.log(Originalquantity);

        // if (initalQuantity > Originalquantity)
        // {
        //     return res.status(500).json({ success: false, message: "Not Enough Quantity we have of your selected product" });
        // }

        cart.products = [];
        await cart.save();

        res.status(200).json({ success: true, message: "Checkout successful" });
    } 
    catch (error) 
    {
        console.error("Error in checkout:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};





module.exports = {addToCart, getCartByUserId
                 ,removeFromCart,  checkoutfromcart};