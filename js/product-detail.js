import { obtenerProductos } from './api.js';
import { mostrarDetalleProducto, actualizarInterfazCarrito, actualizarHeaderUsuario, actualizarBotonesTienda } from './ui.js';
import { agregarAlCarrito, obtenerCarrito, calcularTotalCarrito, contarProductosCarrito, restarOEliminarDelCarrito } from './carrito.js';
import { obtenerUsuarioLogueado } from './auth.js';
import { mostrarSugerenciasBusqueda } from './ui.js';

let productoActual = null;
let todosLosProductos = [];

async function iniciarDetalle() {
    // Renderizamos la interfaz inicial (Header y Carrito lateral)
    renderizarTodo();

    // Extraemos el ID del producto desde la URL (?id=X)
    const parametrosURL = new URLSearchParams(window.location.search);
    const idProducto = Number(parametrosURL.get('id'));
    // Si no encuentra el id, muestra este mensaje
    if (!idProducto) {
        document.getElementById('contenedor-detalle').innerHTML = `<p class="text-center my-5 text-danger">Producto no especificado.</p>`;
        return;
    }

    // Buscamos el producto en la API
    todosLosProductos = await obtenerProductos();
    productoActual = todosLosProductos.find(p => p.id === idProducto);

    if (!productoActual) {
        document.getElementById('contenedor-detalle').innerHTML = `<p class="text-center my-5 text-danger">El producto solicitado no existe.</p>`;
        return;
    }

    // 4. Dibujamos el producto en pantalla y refrescamos el estado de su botón "Agregar"
    mostrarDetalleProducto(productoActual);
    actualizarBotonesTienda(obtenerCarrito());

    // 5. Encendemos los escuchadores de clics
    configurarEventos();
}

function renderizarTodo() {
    // Mantener la misma lógica de actualización del header
    const usuarioActual = obtenerUsuarioLogueado();
    actualizarHeaderUsuario(usuarioActual, () => {
        window.location.reload();
    });

    // Sincroniza el carrito lateral
    const carritoActual = obtenerCarrito();
    const totalDinero = calcularTotalCarrito();
    const totalProductos = contarProductosCarrito();
    actualizarInterfazCarrito(carritoActual, totalDinero, totalProductos);
}

function configurarEventos() {
    //botón agregar
    document.addEventListener('click', (evento) => {
        if (evento.target.classList.contains('btn-agregar')) {
            const id = Number(evento.target.dataset.id);
            agregarAlCarrito(id, todosLosProductos);
            renderizarTodo();
        }
    });

    // Boton eliminar
    const contenedorCarrito = document.getElementById('carrito-items-vista');
    if (contenedorCarrito) {
        contenedorCarrito.addEventListener('click', (event) => {
            const boton = event.target.closest("button");
            if (boton && boton.classList.contains('btn-eliminar')) {
                const idProductoEliminar = Number(boton.dataset.id);
                restarOEliminarDelCarrito(idProductoEliminar);
                renderizarTodo();
            }
        });
    }
    // Lógica que busca en detalle
    const inputBusqueda = document.getElementById('busqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (evento) => {
            const textoUsuario = evento.target.value.trim().toLowerCase();

            if (textoUsuario.length < 1) {
                mostrarSugerenciasBusqueda([]);
                return;
            }
            // Busca en todos los productos las coincidencias con lo escrito en el input
            const coincidencias = todosLosProductos.filter(producto => 
                producto.title.toLowerCase().includes(textoUsuario)
            );

            mostrarSugerenciasBusqueda(coincidencias.slice(0, 5));
        });

        // Se oculta la búsqueda si hacen clic afuera
        document.addEventListener('click', (evento) => {
            if (!inputBusqueda.contains(evento.target)) {
                const contenedorSugerencias = document.getElementById('sugerencias-busqueda');
                if (contenedorSugerencias) contenedorSugerencias.classList.add('d-none');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', iniciarDetalle);