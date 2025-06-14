import Product from "../models/productModel.js";
import Counter from "../models/counterModel.js";



export const getProduct = async (req,res)=>{

    try {
        const productId = req.params.productId;
        if (!productId){
            return res.status(400).json({error:"Please add the product id !"});
        }
        const product = await Product.findOne({ productId: Number(productId) });
        if (!product){
            return res.status(404).json({error:"Product not found !"});
        }
        res.status(200).json({product});

    } catch (error) {
        console.log(`Error in the getProduct controller : ${error}`);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products || products.length === 0) {
            return res.status(404).json({ error: "No products found!" });
        }
        res.status(200).json({ products });
        
    } catch (error) {
        console.log(`Error in the getAllProducts controller : ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }

}

export const createProduct = async (req,res)=>{
    try {
        if (req.user.role !== "seller") {
            return res.status(403).json({ error: "You are not authorized to create a product!" });
        }
        const { name, description, price, stock } = req.body;
        if (!name || !description || !price || !stock) {
            return res.status(400).json({ error: "Please fill all the fields!" });
        }

        // Get next productId
        let counter = await Counter.findOneAndUpdate(
            { id: "productId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const newProduct = new Product({
            productId: counter.seq,
            name,
            description,
            price,
            stock,
            seller: req.user._id
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({ product: savedProduct });

    } catch (error) {
        console.log(`Error in the createProduct controller : ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ productId: Number(productId) }); // Fix
        if (!product) {
            return res.status(404).json({ error: "Product not found!" });
        }
        const isOwner = req.user._id.equals(product.seller);
        if (!isOwner) {
            return res.status(403).json({ error: "Forbidden - You're not allowed to update this product!" });
        }
        const update = req.body;
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: Number(productId) }, // Fix
            update,
            { new: true }
        );
        res.status(200).json({ product: updatedProduct });
    } catch (error) {
        console.log(`Error in the updateProduct controller: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ productId: Number(productId) }); // Fix
        if (!product) {
            return res.status(404).json({ error: "Product not found!" });
        }
        
        const isOwner = req.user._id.equals(product.seller);
        if (!isOwner) {
            return res.status(403).json({ error: "Forbidden - You're not allowed to delete this product!" });
        }
        await Product.findOneAndDelete({ productId: Number(productId) }); // Fix
        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
        console.log(`Error in the deleteProduct controller: ${error}`); 
        res.status(500).json({ error: "Internal server error" });
    }
}