import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    categoria: String,
    disponibilidad: Boolean
});

const Product = mongoose.model('Product', productSchema);

export default Product;