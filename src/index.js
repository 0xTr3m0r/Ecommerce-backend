import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import cookieParser from "cookie-parser";


dotenv.config();

import { connectDB } from './lib/db.js';

const app = express();
const PORT =process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/orders',orderRoutes);


connectDB().then(()=>{
    app.listen(PORT,()=>{
    console.log(`I'm listening on : http://localhost:${PORT}`);
})})
