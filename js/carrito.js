// 1. Inicializar el carrito leyendo del localStorage. 
// Si no hay nada guardado todavía, empezamos con un array vacío [].
let carrito = JSON.parse(localStorage.getItem('carrito_market')) || [];

// 2. FUNCIÓN: Agregar un producto al carrito
export function agregarAlCarrito(idProducto, listaProductos) {
    // Buscamos si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === idProducto);

    if (productoExistente) {
        // Si ya estaba, le sumamos 1 a la cantidad
        productoExistente.cantidad++;
    } else {
        // Si es nuevo, buscamos sus datos en la lista de la API
        const productoBase = listaProductos.find(prod => prod.id === idProducto);
        
        // Creamos el nuevo objeto para el carrito con cantidad inicial 1
        const nuevoItem = {
            id: productoBase.id,
            titulo: productoBase.title,
            precio: productoBase.price,
            imagen: productoBase.image,
            cantidad: 1
        };
        // sumamos el nuevoItem a carrito
        carrito.push(nuevoItem);
    }

    // Guardamos la lista actualizada en el localStorage
    guardarCarritoEnStorage();
}

// Obtener el carrito actual
export function obtenerCarrito() {
    return carrito;
}

// Contar cuántos productos en total hay (para el globito rojo)
export function contarProductosCarrito() {
    // Sumamos las cantidades de todos los items
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}

// Calcular el precio total de la compra
export function calcularTotalCarrito() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// FUNCIÓN INTERNA: Guarda los datos como texto en el localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito_market', JSON.stringify(carrito));
}

export function restarOEliminarDelCarrito(idProducto) {
    // Buscamos el producto en el carrito
    const productoExistente = carrito.find(item => item.id === idProducto);

    if (productoExistente) {
        // Le restamos 1 a la cantidad
        productoExistente.cantidad--;

        // Si la cantidad llegó a 0, lo borramos por completo de la lista
        if (productoExistente.cantidad === 0) {
            // .filter() crea un nuevo array dejando afuera al producto que tiene este id
            carrito = carrito.filter(item => item.id !== idProducto);
        }
    }

    // Guardamos la lista actualizada en el localStorage para que se borre del disco
    guardarCarritoEnStorage();
}