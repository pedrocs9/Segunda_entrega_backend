const socket = io();

// Actualizar la lista de productos
socket.on('updateProducts', (productos) => {
    const lista = document.getElementById('lista-productos');
    lista.innerHTML = '';
    productos.forEach(producto => {
        const item = document.createElement('li');
        item.id = producto.id;
        item.innerHTML = `${producto.nombre} - ${producto.precio} <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>`;
        lista.appendChild(item);
    });
});

// Enviar nuevo producto
document.getElementById('form-agregar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const id = Date.now().toString();
    socket.emit('nuevoProducto', { id, nombre, precio });
    e.target.reset();
});

// Eliminar producto
function eliminarProducto(id) {
    socket.emit('eliminarProducto', id);
}
