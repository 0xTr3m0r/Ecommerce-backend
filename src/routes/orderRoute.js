import express from 'express';
import { createOrder, getOrderById, updateOrder,getMyorders,deleteOrder} from '../controllers/orderController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.post('/',protectRoute, createOrder);
router.get('/myOrders',protectRoute,getMyorders)
router.get('/:id',protectRoute,  getOrderById);
router.put('/:id',protectRoute,  updateOrder);
router.delete('/:id', protectRoute, deleteOrder);
 
export default router;