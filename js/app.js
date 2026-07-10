import { obtenerProductos } from './api.js';
import { mostrarProductosEnTienda, actualizarInterfazCarrito, actualizarHeaderUsuario } from './ui.js'; 
import { agregarAlCarrito, obtenerCarrito, calcularTotalCarrito, contarProductosCarrito, restarOEliminarDelCarrito } from './carrito.js';
import { obtenerUsuarioLogueado, cerrarSesion } from './auth.js'; 

let productosDeLaTienda = [];

async function iniciarApp() {
    renderizarCarrito();
    // Guardamos los productos en nuestra variable 
    productosDeLaTienda = await obtenerProductos();
    mostrarProductosEnTienda(productosDeLaTienda, 8);
    configurarEventosBotones();
    renderizarCarrito(); // Esto ahora va a dibujar el carrito Y el header
}

function renderizarCarrito() {
    // A) Primero nos fijamos si hay algún usuario con sesión activa
    const usuarioActual = obtenerUsuarioLogueado(); 
    
    // B) Pasamos una función que recarga la página al cerrar sesión
    actualizarHeaderUsuario(usuarioActual, () => {
        window.location.reload(); 
    });

    // C) Info del carrito
    const carritoActual = obtenerCarrito();
    const totalDinero = calcularTotalCarrito();
    const totalProductos = contarProductosCarrito();
    actualizarInterfazCarrito(carritoActual, totalDinero, totalProductos);
}

function configurarEventosBotones() {
    // Seleccionamos el contenedor padre de todos los productos
    const contenedor = document.getElementById('contenedor-productos');
    // botón para agregar el producto al carrito y actualizarlo
    contenedor.addEventListener('click', (evento) => {
        if (evento.target.classList.contains('btn-agregar')) {
            const idProductoSeleccionado = Number(evento.target.dataset.id);
            agregarAlCarrito(idProductoSeleccionado, productosDeLaTienda);
            renderizarCarrito();
        }
    });
    //Boton para eliminar el item o cantidad si apretamos el boton eliminar
    const contenedorCarrito = document.getElementById('carrito-items-vista');
    if (contenedorCarrito) {
        contenedorCarrito.addEventListener('click', (event) => {
            const boton = event.target.closest("button");
            if (boton && boton.classList.contains('btn-eliminar')) {
                const idProductoEliminar = Number(boton.dataset.id);
                restarOEliminarDelCarrito(idProductoEliminar);
                renderizarCarrito();
            }
        });
    }

    // boton para iniciar la compra. si no hay nada, no dirige la pág al checkout,
    const btnIniciarCompra = document.querySelector('.btn-iniciar-compra');

    if (btnIniciarCompra) {
        btnIniciarCompra.addEventListener('click', (evento) => {
            // Traemos el carrito actual 
            const carritoActual = obtenerCarrito(); 
            //Si el carrito está vacío, no lo dejamos avanzar
            if (carritoActual.length === 0) {
                evento.preventDefault(); 
                alert("⚠️ Tu carrito está vacío. ¡Agrega algún producto para poder comprar!");
                return;
            }
            console.log("¡Todo listo! El cliente avanza al checkout.");
        });
    }
}

iniciarApp();