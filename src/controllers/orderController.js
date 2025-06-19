import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const createOrder = async (req,res)=>{
    const userId = req.user._id;
    const { items, totalAmount } = req.body;
    try {
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order items are required" });
        }
        if (totalAmount <= 0) {
            return res.status(400).json({ message: "Total amount must be greater than zero" });
        }
        const order = new Order({
            user: userId,
            items,
            totalAmount
        });
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getOrderById = async (req,res)=>{
    const orderId = req.params.id;
    try {
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }
        const order = await Order.findById(orderId).populate('user', 'name email').populate('items.product', 'name price');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyorders = async (req,res)=>{
    const userId=req.user._id;
    try {
        const myOrders = await Order.find({ user: userId });
        if (!myOrders || myOrders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }
        res.status(200).json(myOrders);

    } catch (error) {
        console.error("Error fetching user's orders:", error);
        res.status(500).json({ message: "Internal server error" }); 
    }
}

export const updateOrder  = async(req,res)=>{
    const update = req.body;
    try {
        const order = await Order.findOne({_id: req.params.id});
        if (!order){
            return res.status(404).json({error : "Order not found !"});
        }
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            update,
            {new: true}
        );
        res.status(200).json({updatedOrder});

    } catch (error) {
        console.log(`Error in the updateOrder controller: ${error}`);
        res.status(500).json({error : "Internal server error !"});
    }
}

export const deleteOrder = async (req,res)=>{
    const orderId = req.params.id;
    try {
        if (!orderId){
            return res.status(400).json({error:"No specified order !"});
        }
        const order = await Order.findById(orderId);
        if (!order){
            return res.status(404).json({error:"Order Not found !"});
        }
        if(req.user._id.toString() !== order.user.toString()){
            return res.status(403).json({error:"You are not allowed to delete this order !"});
        }
        await Order.findByIdAndDelete(orderId);
        res.status(200).json({message: "Order deleted successfully"});
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({error: "Internal server error !"});
    }
}