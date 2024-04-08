const axios = require('axios');

const Product = require('../models/Product')

const getAllProducts = async(req, res) => {
    try
    {

        // const response = await axios.get('http://localhost:8082/api/inventory/getall');
        // const products = response.data.products;

        // res.status(200).send({
        //     success:true,
        //     products
        // });

        const products = await Product.find();
        if (!products)
        {
            res.status(404).send({
                success:false,
                message:"no products present"
            })
        }

        res.status(200).send({
            success:true,
            products
        })

    }
    catch(err)
    {
        console.log(err),
        res.staus(500).send({
            success:false,
            message:"Error in get ALL products APi",
            err
        })
    }
}


const getProductById = async(req, res) => {
    try
    {
        const productId = req.params.id;
        //console.log("product id is ", productId);

        const product = await Product.findById(productId);
        if (!product)
        {
            return res.status(404).send({
                success:false,
                message:"No product Found with hits IDS"
            })
        }

        res.status(200).send({
            success:false,
            product
        })
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Error in GET SINGlE product API",
            err
        })
    }
}


const createProductController = async(req, res) => {
    try
    {
        const {
            name,
            price,
            size,
            design,
            quantity
          } = req.body;

        if (!name || !size || !price || !quantity || !design)
        {
            return res.status(500).send({
                success:false,
                message:"Please provide all fields"
            });
        }
        //console.log("HI");




        const newProduct = new Product({
            name,
            price,
            size,
            design,
            quantity
        });

            //passing it to inventory sevice such that product get updated there also:
            await axios.post('http://localhost:8082/api/inventory/add', {
            productId: newProduct._id,
            quantity: req.body.quantity 
        });

        await newProduct.save();
        res.status(201).send({
            success:true,
            message:"New products Item Created",
            newProduct
        });

    }
    catch(err)
    {
        console.log(err),
        res.status(500).send({
            success:false,
            message:"Error in create newProduct APi",
            err
        })
    }
}



const productUpdateController = async(req, res) => {
    try
    {
        const productId = req.params.id;
        //console.log("product id is ", productId);
        if (!productId)
        {
            return res.status(404).send({
                success:true,
                message:"no product id was found"
            })
        }

        const product = await Product.findByIdAndUpdate(productId);
        if (!product)
        {
            return res.status(404).send({
                success:true,
                message:"no product found"
            })
        }

        const {
            name,
            price,
            size,
            design
        } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            name,
            price,
            size,
            design
        }, {new:true})


        res.status(200).send({
            success:true,
            message:"Prduct ItemS Updated"
        })
    }

    catch(err)
    {
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Error in update product API",
            err
        })
    }
}


const deleteProductController = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
        return res.status(404).send({
            success: false,
            message: "provide product id",
        });
        }

        const product = await Product.findById(productId);
        if (!product) {
        return res.status(404).send({
            success: false,
            message: "No product Found with id",
        });
        }


        await Product.findByIdAndDelete(productId);
        res.status(200).send({
            success: true,
            message: "product Item Dleeted ",
        });
    } 

    // try 
    // {
    //     const productId = req.params.id;
    //     await axios.delete(`http://localhost:8082/api/inventory/delete/${productId}`);

    //     res.status(200).send({
    //         success: true,
    //         message: "Product removed successfully"
    //     });
    // } 

    catch (error)
     {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Eror In Delete product APi",
        error,
        });
    }
};




/////////////////////// Communication between Services //////////////////////////////////////////////////


////defining a controller to get accessed from user service:
const getProductDetails = async (req, res) => {
    try 
    {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        
        if (!product)
        {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        
        res.status(200).json({ success: true, product });
    } 
    catch (error) 
    {
        console.error("Error in getProductDetails:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



//defining to fetch product details from inventory service:
const getProductDetailsFromInventory = async (req, res) => {
    try 
    {
        const productId = req.params.productId;

        const response = await axios.get(`http://localhost:8082/api/inventory/get/${productId}`);
        res.status(response.status).json(response.data);
    } 
    catch (error)
    {
        console.error("Error in getProductDetailsFromInventory:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};




//export
module.exports = {getProductDetailsFromInventory, getAllProducts, getProductById, 
    createProductController, deleteProductController, productUpdateController, getProductDetails}