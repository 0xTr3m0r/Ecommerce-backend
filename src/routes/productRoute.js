import express from "express";
import {createProduct, deleteProduct,updateProduct,getAllProducts,getProduct} from "../controllers/productController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:productId', getProduct);
router.post('/', protectRoute, createProduct);
router.put('/:productId', protectRoute, updateProduct);
router.delete('/:productId', protectRoute, deleteProduct);


export default router ;