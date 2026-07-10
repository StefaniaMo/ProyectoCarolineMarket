// js/ui.js
import { cerrarSesion } from './auth.js';

const contenedorAuthHeader = document.getElementById('contenedor-auth-header');

export function actualizarHeaderUsuario(usuarioLogueado, callbackCerrar) {
    if (!contenedorAuthHeader) return; 
    
    if (!usuarioLogueado || usuarioLogueado === "null" || usuarioLogueado === "undefined") {
        usuarioLogueado = null;
    }

    if (usuarioLogueado === 'invitado') {
        contenedorAuthHeader.innerHTML = `
            <span class="text-dark small fw-bold me-2">¡Bienvenido!</span>
            <span class="text-muted small">|</span>
            <a href="login.html" class="text-secondary text-decoration-none small ms-2">Iniciar sesión</a>
        `;
    } 
    // 🟢 SI ES UN USUARIO REGISTRADO CON NOMBRE
    else if (usuarioLogueado) {
        contenedorAuthHeader.innerHTML = `
            <span class="text-muted small me-2">Hola, <strong class="text-dark">${usuarioLogueado}</strong></span>
            <span class="text-muted small">|</span>
            <button id="btn-cerrar-sesion" class="btn btn-link text-danger text-decoration-none small ms-2 p-0 border-0 alignment-baseline" style="font-size: 0.875rem; vertical-align: baseline;">
                Cerrar sesión
            </button>
        `;

        const btnCerrar = document.getElementById('btn-cerrar-sesion');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => {
                cerrarSesion();
                alert("Has cerrado sesión correctamente.");
                callbackCerrar(); 
            });
        }
    } 
    // 🟢 SI NO HAY NADIE LOGUEADO
    else {
        contenedorAuthHeader.innerHTML = `
            <a href="registro.html" class="text-secondary text-decoration-none small me-2">Crear cuenta</a>
            <span class="text-muted small">|</span>
            <a href="login.html" class="text-secondary text-decoration-none small ms-2">Iniciar sesión</a>
        `;
    }
}


//  MOSTRAR PRODUCTOS EN TIENDA 
export function mostrarProductosEnTienda(productos, limite = null) {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    contenedor.innerHTML = ''; // Limpiamos el contenedor

    const productosAMostrar = limite ? productos.slice(0, limite) : productos;

    productosAMostrar.forEach(producto => {
        const columna = document.createElement('div');
        columna.classList.add('col');

        columna.innerHTML = `
            <div class="card h-100 border-0 shadow-sm producto-tarjeta">
                <div class="p-3 d-flex align-items-center justify-content-center bg-light" style="height: 220px;">
                    <img src="${producto.image}" class="card-img-top img-fluid" alt="${producto.title}" style="max-height: 100%; width: auto; object-fit: contain;">
                </div>
                <div class="card-body d-flex flex-column justify-content-between p-3">
                    <div>
                        <p class="text-muted small text-uppercase mb-1">${producto.category}</p>
                        <h5 class="card-title fs-6 text-dark text-truncate-2" title="${producto.title}">${producto.title}</h5>
                    </div>
                    <div class="mt-3">
                        <p class="card-text fw-bold fs-5 text-dark mb-2">$${Number(producto.price).toFixed(2)}</p>
                        <button class="btn btn-dark w-100 btn-sm btn-agregar" data-id="${producto.id}">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        // Metemos la columna limpia adentro del contenedor principal
        contenedor.appendChild(columna);
    });
}

// Elementos de la vista del carrito (IDs unificados con tu HTML)
const contenedorCarritoVista = document.getElementById('carrito-items-vista');
const totalCarritoVista = document.getElementById('carrito-total-vista');
const contadorCarritoHeader = document.getElementById('contador-carrito');

// 2️ ACTUALIZAR INTERFAZ CARRITO
export function actualizarInterfazCarrito(carrito, totalDinero, totalProductos, callbackRender) {
    actualizarBotonesTienda(carrito);

    if (contadorCarritoHeader) {
        contadorCarritoHeader.textContent = totalProductos;
    }

    if (totalCarritoVista) {
        totalCarritoVista.textContent = `$${totalDinero.toFixed(2)}`; // 👈 Línea restaurada para mostrar el dinero
    }

    if (!contenedorCarritoVista) return;

    if (carrito.length === 0) {
        contenedorCarritoVista.innerHTML = `<p class="text-muted text-center my-4">Tu carrito está vacío.</p>`;
        return; 
    }

    contenedorCarritoVista.innerHTML = '';

    carrito.forEach(item => {
        const filaMiniatura = document.createElement('div');
        filaMiniatura.classList.add('d-flex', 'align-items-center', 'gap-3', 'mb-3', 'pb-3', 'border-bottom');
        
        filaMiniatura.innerHTML = `
            <div style="width: 60px; height: 60px;" class="d-flex align-items-center justify-content-center bg-white p-1 border rounded">
                <img src="${item.imagen}" alt="${item.titulo}" class="img-fluid" style="max-height: 100%; object-fit: contain;">
            </div>
            
            <div class="flex-grow-1">
                <h6 class="small mb-1 text-dark text-truncate" style="max-width: 150px;" title="${item.titulo}">${item.titulo}</h6>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted small">$${Number(item.precio).toFixed(2)} x ${item.cantidad}</span>
                    <span class="fw-bold small text-dark">$${(Number(item.precio) * item.cantidad).toFixed(2)}</span>
                </div>
            </div>

            <div>
                <button class="btn btn-sm btn-outline-danger border-0 p-1 btn-eliminar" data-id="${item.id}">
                    <i class="bi bi-trash3 fs-6 pointer-events-none"></i>
                </button>
            </div>
        `;

        contenedorCarritoVista.appendChild(filaMiniatura);
    });
}

// 3️ ACTUALIZAR BOTONES TIENDA
export function actualizarBotonesTienda(carrito) {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');

    botonesAgregar.forEach(boton => {
        const idProductoBoton = Number(boton.dataset.id);
        const productoEnCarrito = carrito.find(item => item.id === idProductoBoton);

        if (productoEnCarrito) {
            if (productoEnCarrito.cantidad > 1) {
                boton.textContent = `✓ Agregado x${productoEnCarrito.cantidad}`;
            } else {
                boton.textContent = '✓ Agregado';
            }
            boton.classList.remove('btn-dark');
            boton.classList.add('btn-success'); 
        } else {
            boton.textContent = 'Agregar al carrito';
            boton.classList.remove('btn-success');
            boton.classList.add('btn-dark');
        }
    });
}