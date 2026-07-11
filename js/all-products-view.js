import { obtenerProductos } from './api.js';
import { mostrarProductosEnTienda, actualizarInterfazCarrito, actualizarHeaderUsuario } from './ui.js';
import { agregarAlCarrito, obtenerCarrito, calcularTotalCarrito, contarProductosCarrito, restarOEliminarDelCarrito } from './carrito.js';
import { obtenerUsuarioLogueado } from './auth.js';
import { mostrarSugerenciasBusqueda } from './ui.js';


let productosFiltradosPagina = [];

async function iniciarPaginaProductos() {
    // 1. Leer qué categoría viene en la barra de direcciones de la pestaña
    const parametrosURL = new URLSearchParams(window.location.search);
    const categoriaRecibida = parametrosURL.get('categoria') || 'todos'; // Si no viene nada, por defecto es 'todos'

    const elBreadcrumb = document.getElementById('dinamico-breadcrumb');
    if (elBreadcrumb) {
        // Definimos el texto final que se va a mostrar según la API
        let textoFinal = '';
        
        if (categoriaRecibida === 'todos') {
            textoFinal = 'Todos los productos';
        } else if (categoriaRecibida === "men's clothing") {
            textoFinal = 'Ropa Masculina';
        } else if (categoriaRecibida === "women's clothing") {
            textoFinal = 'Ropa Femenina';
        } else if (categoriaRecibida === 'electronics') {
            textoFinal = 'Electrónica';
        } else if (categoriaRecibida === 'jewelery') {
            textoFinal = 'Joyería';
        }

        // Inyectamos la estructura usando las clases de Bootstrap
        elBreadcrumb.innerHTML = `
            <li class="breadcrumb-item"><a href="index.html" class="text-secondary text-decoration-none">Productos</a></li>
            <li class="breadcrumb-item text-secondary text-capitalize">Categoría</li>
            <li class="breadcrumb-item active text-dark fw-bold" aria-current="page">${textoFinal}</li>
        `;
    }
    // 2. Traer todos los productos desde tu API
    const todosLosProductos = await obtenerProductos();

    // 3. Tomar la decisión: ¿Filtramos o mostramos todo?
    if (categoriaRecibida === 'todos') {
        productosFiltradosPagina = todosLosProductos;
    } else {
        // Filtramos quedándonos solo con los que coincidan exactamente con la URL
        productosFiltradosPagina = todosLosProductos.filter(prod => prod.category === categoriaRecibida);
    }

    // 4. Dibujar los productos en la tienda (reutilizando tu ui.js)
    mostrarProductosEnTienda(productosFiltradosPagina);

    // 5. Encender los eventos de los botones y renderizar el carrito/header

    configurarEventosBotones();
    renderizarTodo();
    
}

function renderizarTodo() {
    // Actualizar el header con el usuario activo
    const usuarioActual = obtenerUsuarioLogueado();
    actualizarHeaderUsuario(usuarioActual, () => {
        window.location.reload(); 
    });

    // Actualizar el carrito lateral
    const carritoActual = obtenerCarrito();
    const totalDinero = calcularTotalCarrito();
    const totalProductos = contarProductosCarrito();
    actualizarInterfazCarrito(carritoActual, totalDinero, totalProductos);
}

function configurarEventosBotones() {
    // Oidor para agregar productos
    const contenedor = document.getElementById('contenedor-productos');
    if (contenedor) {
        contenedor.addEventListener('click', (evento) => {
            if (evento.target.classList.contains('btn-agregar')) {
                const idProductoSeleccionado = Number(evento.target.dataset.id);
                // Le pasamos la lista actual de la página para que busque los datos base
                agregarAlCarrito(idProductoSeleccionado, productosFiltradosPagina);
                renderizarTodo();
            }
        });
    }

    // Oidor para eliminar productos (tu delegación de eventos con closest)
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
}

// Suponiendo que tienes guardados todos los productos en una variable global como 'productosDeLaTienda'
const inputBusqueda = document.getElementById('busqueda');

if (inputBusqueda) {
    inputBusqueda.addEventListener('input', (evento) => {
        const textoUsuario = evento.target.value.trim().toLowerCase();

        // Si el usuario borró todo, ocultamos las sugerencias pasándole un array vacío
        if (textoUsuario.length < 1) {
            mostrarSugerenciasBusqueda([]);
            return;
        }

        // Filtramos de la lista global los productos que contengan las letras tipeadas en su título
        // Reemplaza 'productosDeLaTienda' por el nombre real de tu array de productos si se llama diferente
        const coincidencias = productosFiltradosPagina.filter(producto => 
            producto.title.toLowerCase().includes(textoUsuario)
        );

        // Le mandamos las coincidencias encontradas a la UI para que las dibuje (máximo 5 para no saturar)
        mostrarSugerenciasBusqueda(coincidencias.slice(0, 5));
    });

    // Oculta la sugerencia si el usuario hace click afuera
    document.addEventListener('click', (evento) => {
        if (!inputBusqueda.contains(evento.target)) {
            const contenedorSugerencias = document.getElementById('sugerencias-busqueda');
            if (contenedorSugerencias) contenedorSugerencias.classList.add('d-none');
        }
    });
}

// Arrancar la ejecución
iniciarPaginaProductos();