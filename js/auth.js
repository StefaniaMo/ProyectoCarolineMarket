// js/auth.js

// 1. Traer la base de datos de usuarios de localStorage (o empieza vacía)
let usuarios = JSON.parse(localStorage.getItem('usuarios_market')) || [];

//  Función para registrar un nuevo usuario 
export function registrarUsuario(nombreCompleto, email, password) {
    // Validamos si el email ya existe en nuestra lista
    const usuarioExistente = usuarios.find(u => u.email === email.trim().toLowerCase());
    
    if (usuarioExistente) {
        return { exito: false, mensaje: "Este correo ya está registrado." };
    }
    
    // Si no existe, creamos el nuevo usuario y guardamos su nombre también
    const nuevoUsuario = { 
        nombre: nombreCompleto, 
        email: email.trim().toLowerCase(), 
        password: password 
    };
    
    usuarios.push(nuevoUsuario);
    
    // Guardamos la lista actualizada en localStorage
    localStorage.setItem('usuarios_market', JSON.stringify(usuarios));
    return { exito: true, mensaje: "¡Cuenta creada con éxito!" };
}

//  Función Iniciar Sesión
export function loginUsuario(email, password) {
    // Buscamos si existe un usuario con ese correo electrónico y esa contraseña
    const usuarioEncontrado = usuarios.find(
        user => user.email === email.trim().toLowerCase() && user.password === password
    );

    // Si no coincide ninguno, devolvemos el fallo para el alert del login.js
    if (!usuarioEncontrado) {
        return {
            exito: false,
            mensaje: "❌ Correo electrónico o contraseña inválidos. Inténtalo de nuevo."
        };
    }

    // SI COINCIDE: Guardamos su Nombre Completo en la sesión 'usuario_logueado'
    localStorage.setItem('usuario_logueado', usuarioEncontrado.nombre);

    return {
        exito: true,
        mensaje: `¡Bienvenido de vuelta, ${usuarioEncontrado.nombre}! 👋`
    };
}

//Retorna el nombre de la sesión activa para que app.js y ui.js lo lean
export function obtenerUsuarioLogueado() {
    return localStorage.getItem('usuario_logueado');
}

// Borra la sesión activa al tocar "Cerrar sesión" sin romper la base de usuarios
export function cerrarSesion() {
    localStorage.removeItem('usuario_logueado');
}