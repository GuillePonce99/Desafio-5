import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;
const collection = "carts"

const productsSchema = new Schema({
    _id: Types.ObjectId,
    name: String,
    quantity: Number,
    total: Number
})

const cartsSchema = new Schema({
    _id: Types.ObjectId,
    products: [productsSchema]
});

const CartsModel = mongoose.model(collection, cartsSchema)
export default CartsModel
