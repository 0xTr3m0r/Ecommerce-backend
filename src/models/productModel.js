import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },
  name: String,
  description: String,
  price: Number,
  stock: Number,
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;