import * as mongoose from "mongoose";
import Product from "./product.interface";

const productSchema = new mongoose.Schema({
    uuid:String,
    name:String,
    description:String,
    category:String,
    price:Number,
    stock:Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const productModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);

export default productModel;