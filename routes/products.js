import express from 'express';

const router = express.Router();

let productos = [];

// Endpoint para obtener productos con paginación, filtro y ordenamiento
router.get('/', (req, res) => {
    const { limit = 10, page = 1, query, sort } = req.query;

    let filteredProducts = [...productos]; // Copiamos la lista de productos

    // Aplicar filtro si se pasa un query
    if (query) {
        filteredProducts = filteredProducts.filter(producto =>
            producto.categoria.toLowerCase() === query.toLowerCase() ||
            (query === 'disponible' && producto.disponibilidad) ||
            (query === 'no disponible' && !producto.disponibilidad)
        );
    }

    // Aplicar ordenamiento si se pasa sort
    if (sort === 'asc') {
        filteredProducts.sort((a, b) => a.precio - b.precio);
    } else if (sort === 'desc') {
        filteredProducts.sort((a, b) => b.precio - a.precio);
    }

    // Paginación
    const totalPages = Math.ceil(filteredProducts.length / limit);
    const start = (page - 1) * limit;
    const end = start + Number(limit);
    const paginatedProducts = filteredProducts.slice(start, end);

    // Información de la paginación
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? parseInt(page) + 1 : null;

    const response = {
        status: 'success',
        payload: paginatedProducts,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: Number(page),
        hasPrevPage: prevPage !== null,
        hasNextPage: nextPage !== null,
        prevLink: prevPage ? `/?limit=${limit}&page=${prevPage}&query=${query || ''}&sort=${sort || ''}` : null,
        nextLink: nextPage ? `/?limit=${limit}&page=${nextPage}&query=${query || ''}&sort=${sort || ''}` : null,
    };

    res.json(response);
});

// Endpoint para renderizar la vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { productos });
});

export default router;
