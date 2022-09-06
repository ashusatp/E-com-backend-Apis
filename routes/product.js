const router = require('express').Router()
const Cart = require("../models/Cart");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

// create
router.post("/" , verifyToken, async (req,res) => {
    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
});

// update
router.put("/:id", verifyTokenAndAuthorization ,async (req,res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id ,
            {
                $set : req.body,
            },
            {new : true},
        );
        res.status(200).json(updatedCart);
    }
    catch(err){
        res.status(500).json(err);
    }
});

// delete
router.delete("/:id" ,verifyTokenAndAdmin ,async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});


// getProduct
router.get("/find/:id" ,verifyTokenAndAdmin ,async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product); 
    }catch(err){
        res.status(500).json(err);
    }
});


// getAllProducts
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {

        let products;
        if(qNew){
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        }else if(qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            });
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);

    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports  = router