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
    //  SI ES UN USUARIO REGISTRADO CON NOMBRE
    else if (usuarioLogueado) {
        contenedorAuthHeader.innerHTML = `
            <span class="text-muted me-2">Hola, <strong class="text-dark">${usuarioLogueado}</strong></span>
            <span class="text-muted">|</span>
            <button id="btn-cerrar-sesion" class="btn btn-link text-danger text-decoration-none fw-medium ms-2 p-0 border-0 align-baseline" style="font-size: 0.875rem;">
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
    //  SI NO HAY NADIE LOGUEADO
    else {
        contenedorAuthHeader.innerHTML = `
            <a href="registro.html" class="text-secondary text-decoration-none fw-medium me-2">Crear cuenta</a>
            <span class="text-muted">|</span>
            <a href="login.html" class="text-secondary text-decoration-none fw-medium ms-2">Iniciar sesión</a>
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
                    
                    <a href="product-detail.html?id=${producto.id}" class="w-100 h-100 d-flex align-items-center justify-content-center text-decoration-none">
                        <img src="${producto.image}" class="card-img-top img-fluid" alt="${producto.title}" style="max-height: 100%; width: auto; object-fit: contain;">
                    </a>

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




// 2️ ACTUALIZAR INTERFAZ CARRITO
export function actualizarInterfazCarrito(carrito, totalDinero, totalProductos, callbackRender) {
    // Elementos de la vista del carrito 
    const contenedorCarritoVista = document.getElementById('carrito-items-vista');
    const totalCarritoVista = document.getElementById('carrito-total-vista');
    const contadorCarritoHeader = document.getElementById('contador-carrito');

    actualizarBotonesTienda(carrito);
    // Actualizamos el contador del globito rojo si existe en la página actual
    if (contadorCarritoHeader) {
        contadorCarritoHeader.textContent = totalProductos;
    }
    // Actualizamos el precio total del carrito si existe en la página actual
    if (totalCarritoVista) {
        totalCarritoVista.textContent = `$${totalDinero.toFixed(2)}`; 
    }
    // Si la página actual no tiene el carrito lateral, salimos
    if (!contenedorCarritoVista) return;
    // Si está vacío, mostramos el cartel correspondiente
    if (carrito.length === 0) {
        contenedorCarritoVista.innerHTML = `<p class="text-muted text-center my-4">Tu carrito está vacío.</p>`;
        return; 
    }
    // Limpiamos los productos anteriores antes de redibujar
    contenedorCarritoVista.innerHTML = '';

    carrito.forEach(item => {
        const filaMiniatura = document.createElement('div');
        filaMiniatura.classList.add('d-flex', 'align-items-center', 'gap-3', 'mb-3', 'pb-3', 'border-bottom');
        
        filaMiniatura.innerHTML = `
            <div style="width: 60px; height: 60px; min-width: 60px;" class="d-flex align-items-center justify-content-center bg-white p-1 border rounded">
                
                <a href="product-detail.html?id=${item.id}" class="w-100 h-100 d-flex align-items-center justify-content-center text-decoration-none">
                    <img src="${item.imagen}" alt="${item.titulo}" class="img-fluid" style="max-height: 100%; max-width: 100%; object-fit: contain;">
                </a>

            </div>
            
            <div class="flex-grow-1">
                <h6 class="small mb-1 text-dark text-truncate" style="max-width: 150px;" title="${item.titulo}">
                    <a href="product-detail.html?id=${item.id}" class="text-dark text-decoration-none fw-medium">${item.titulo}</a>
                </h6>
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

//  Actualizar los botones para agregar producto
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

export function mostrarDetalleProducto(producto) {
    const contenedor = document.getElementById('contenedor-detalle');
    const breadcrumb = document.getElementById('breadcrumb-actual');
    if (!contenedor) return;

    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <span class="text-lowercase text-muted">${producto.category}</span> 
            <span class="mx-2 text-secondary">/</span> 
            <span class="text-dark fw-medium">${producto.title}</span>
        `;
    }

    contenedor.innerHTML = `
        <div class="row g-5 align-items-start pt-3">
            
            <div class="col-md-6">
                <div class="p-4 bg-light rounded d-flex align-items-center justify-content-center" style="min-height: 350px;">
                    <img src="${producto.image}" alt="${producto.title}" class="img-fluid rounded" style="max-height: 400px; width: auto; object-fit: contain;">
                </div>
            </div>
            
            <div class="col-md-6">
                <p class="text-muted text-uppercase mb-2 small fw-semibold" style="letter-spacing: 1px;">${producto.category}</p>
                <h1 class="h2 fw-bold text-dark mb-3">${producto.title}</h1>
                
                <div class="mb-4">
                    <span class="fs-3 fw-bold text-dark">$${Number(producto.price).toFixed(2)}</span>
                </div>
                
                <hr class="text-muted my-4">
                
                <h5 class="text-secondary fs-6 fw-bold mb-2">Descripción del producto</h5>
                <p class="text-muted lh-base">${producto.description}</p>
                
                <div class="mt-5">
                    <button class="btn btn-dark btn-lg px-5 w-100 btn-agregar" data-id="${producto.id}">
                        Agregar al carrito
                    </button>
                </div>
            </div>

        </div>
    `;
}

export function mostrarSugerenciasBusqueda(productosFiltrados) {
    const contenedorSugerencias = document.getElementById('sugerencias-busqueda');
    if (!contenedorSugerencias) return;

    // Si no hay productos que coincidan o la lista viene vacía, ocultamos el cartel
    if (productosFiltrados.length === 0) {
        contenedorSugerencias.classList.add('d-none');
        contenedorSugerencias.innerHTML = '';
        return;
    }

    // Mostramos el contenedor y limpiamos el contenido previo
    contenedorSugerencias.classList.remove('d-none');
    contenedorSugerencias.innerHTML = '';

    // Aparece un renglon clickeable por cada sugerencia
    productosFiltrados.forEach(producto => {
        const item = document.createElement('a');
        item.href = `product-detail.html?id=${producto.id}`;
        item.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'align-items-center', 'gap-2', 'py-2', 'border-0', 'bg-white');
        
        item.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}" style="width: 30px; height: 30px; object-fit: contain;">
            <div class="flex-grow-1 text-truncate">
                <span class="small text-dark d-block text-truncate fw-medium">${producto.title}</span>
                <span class="text-muted" style="font-size: 0.75rem;">$${Number(producto.price).toFixed(2)}</span>
            </div>
        `;
        
        contenedorSugerencias.appendChild(item);
    });
}