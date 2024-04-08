const userModel = require('../models/userModel')
const JWT = require('jsonwebtoken');
const bcrpyt = require('bcryptjs');
const axios = require('axios');


const RegisterController = async(req, res) => {
    try
    {
        const {userName, email, password,role} = req.body;

        if (!userName || !email || !password)
        {
            return res.status(500).send({
                success:false,
                message:"All Fields are required"
            })
        }

        const existing  = await userModel.findOne({email});
        if (existing)
        {
            return res.status(500).send({
                success: false,
                message: "Email Already Registered",
            })
        }


        //encrypting password hashing:
        const salt = bcrpyt.genSaltSync(8);
        const hashedPas = await bcrpyt.hash(password, salt);

        const User = await userModel.create({
            userName,
            email,
            password:hashedPas,
            role
        })

        console.log(User);

        res.status(201).send({
            success:true,
            message:"Successfully Registered"
        })

    }

    catch(err)
    {
        console.log("REGISTER ERROR", err);
        res.status(500).send({
            success: false,
            message: "Error in Register API",
            err,
        });
    }
}



const loginController = async (req, res) => {
    try 
    {
        const { email, password } = req.body;

        // Validation:
        if ( !email || !password ) 
        {
            return res.status(500).send({
                success: false,
                message: "All fields are required",
            });
        }

        // Check users:
        const user = await userModel.findOne({ email:email});
        if (!user) 
        {
            return res.status(404).send({
                success: false,
                message: "user not found",
            });
        }


        //compare password logic:
        const isMatch = await bcrpyt.compare(password, user.password)
        if (!isMatch)
        {
            return res.status(500).send({
                success:false,
                message:"INCORRECT PASSOWORD"
            });
        }


        //JSON WEB TOKEN:
        const token = JWT.sign({id:user._id, role:user.role}, process.env.JWT_SECRET, {
            expiresIn: "7d",
        })
        

        res.status(200).send({
            success: true,
            message: "Successfully LOGIN",
            token
        });
    } 


    catch (err) 
    {
        console.log("LOGIN ERROR", err);
        res.status(500).send({
            success: false,
            message: "Error in LOGIN API",
            err,
        });
    }
}


const getUserController = async(req, res) => {
    try
    {
        const User = await userModel.findById({_id:req.body.id});

        if (!User)
        {
            return res.status(404).send({
                success:false,
                message:"User not found"
            })
        }

        //find the user:
        res.status(200).send({
            success:true,
            message:"User Get Successfully",
            User
        })

    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Error in GET USER API",
            err
        })
    }
}


/////////////////////// Communication between Services //////////////////////////////////////////////////

//defining the controller to get product details accessed from product-service:
const getUserProductDetails = async (req, res) => {
    try 
    {
        const productId = req.params.productId;
        const response = await axios.get(`http://localhost:8081/api/product/product-details/${productId}`);

        if (!response.data.success) 
        {
            return res.status(404).json({ success: false, message: response.data.message });
        }

        const product = response.data.product;
        // Process the product details as needed
        res.status(200).json({ success: true, product });
    } 
    
    catch (error) 
    {
        console.error("Error in getUserProductDetails:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



//defining the controller to add product to inventory (user to product service):
const addProductToInventory = async (req, res) => {
    //console.log("user add me aaya");

    try 
    {
        const { name, price, size, design, quantity } = req.body;

        const response = await axios.post('http://localhost:8081/api/product/create', { name, price, size, design, quantity });
        res.status(response.status).json(response.data);
        
    } 
    catch (error) 
    {
        console.error("Error in addProductToInventory:", error);
        res.status(500).json({ success: false, message: "Internal server error admin ka error" });
    }
};




//defining the controller to delete product to inventory (user to product service):
const removeProductFromInventory = async (req, res) => {
    try 
    {
        const productId = req.params.id;
        const response = await axios.delete(`http://localhost:8081/api/product/delete/${productId}`);
        res.status(response.status).json(response.data);
    } 
    
    catch (error) 
    {
        console.error("Error in removeProductFromInventory:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


//defining the controller to update product to inventory (user to product service):
const updateProductInInventory = async (req, res) => {
    try
    {
        const productId = req.params.id;
        console.log(productId);

        if (!productId)
        {
            return res.status(404).send({
                success:false,
                message:"no product id was found"
            })
        }
        const {name, price, size, design} = req.body;

        //now calling the product servce from user Service:
        const response = await axios.put(`http://localhost:8081/api/product/update/${productId}`, {name, price, size, design});
        res.status(response.status).json(response.data);
    }
    catch(error)
    {
        console.error("Error in updateProductInInventory:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}



//defining the controller to get ALL product details to inventory (user to product service):
const getAllProductInInventory = async (req, res) => {
    try
    {
        const response = await axios.get(`http://localhost:8081/api/product/getall`);
        res.status(response.status).json(response.data);
    }
    catch(error)
    {
        console.error("Error in getAllProductInInventory:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}



///// USER-SERVICE TO CART-SERVICE///////////////////////

//// Controller to add an item to the cart from user:
const addToCart = async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8084/api/cart/add-to-cart', req.body);
        res.status(response.status).json(response.data);
    } 
    catch (error) 
    {
        console.error("Error in addToCart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



//// Controller to remove an item from the cart
const removeFromCart = async (req, res) => {
    try 
    {
        const { productId } = req.params;

        const response = await axios.delete(`http://localhost:8084/api/cart/delete-to-cart/${productId}?userId=${req.body.id}`);
        res.status(response.status).json(response.data);
    } 
    catch (error) 
    {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



// Controller to checkout
const checkoutfromcart = async (req, res) => {
    try 
    {
        const userId = req.params.id;
        const response = await axios.post(`http://localhost:8084/api/cart/checkout/${userId}`);
        res.status(response.status).json(response.data);
    } 
    catch (error) 
    {
        console.error("Error in checkout:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};







module.exports = {getAllProductInInventory, updateProductInInventory, 
    removeProductFromInventory, addProductToInventory, 
    getUserProductDetails, RegisterController, loginController, getUserController,
    checkoutfromcart, addToCart, removeFromCart};


