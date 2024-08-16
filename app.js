import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cartRoutes from './routes/carts.js'; // Importamos las rutas de carts
import productRoutes from './routes/products.js'; // Importamos las rutas de products

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect("mongodb+srv://1234562024:1234562024@cluster0.e0kzhzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Usar las rutas de carts y products
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);

// Manejo de conexiones socket
let productos = [];
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar lista de productos al nuevo cliente
    socket.emit('updateProducts', productos);

    // Escuchar la creación de un nuevo producto
    socket.on('nuevoProducto', (producto) => {
        productos.push(producto);
        io.emit('updateProducts', productos);
    });

    // Escuchar la eliminación de un producto
    socket.on('eliminarProducto', (id) => {
        productos = productos.filter(producto => producto.id !== id);
        io.emit('updateProducts', productos);
    });
});

// Iniciar el servidor
server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
