import { registrarUsuario } from './auth.js';

// 1️⃣ ESCUCHAR EL FORMULARIO DE REGISTRO
document.getElementById('form-registro')?.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Evitamos que la página se recargue

    // Capturamos los datos 
    const nombre = document.getElementById('login-nombre').value.trim();
    const apellido = document.getElementById('login-apellido').value.trim();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    // Juntamos Nombre y Apellido para el saludo
    const nombreCompleto = `${nombre} ${apellido}`;

    // LE DELEGAMOS TODO EL TRABAJO AL MOTOR (auth.js)
    const resultado = registrarUsuario(nombreCompleto, email, password);

    // Evaluamos la respuesta que nos da el motor
    if (resultado.exito) {
        // Si todo salió bien, avisamos y redirigimos
        alert(resultado.mensaje); // "¡Cuenta creada con éxito!"
        window.location.href = 'login.html';
    } else {
        // Si el mail ya existía, el motor nos avisa acá
        alert(`⚠️ ${resultado.mensaje}`); // "Este correo ya está registrado."
        window.location.href = 'login.html'; 
    }
});

document.getElementById('btn-invitado')?.addEventListener('click', () => {
    // Guardamos 'invitado' en el localStorage para avisarle a la tienda
    localStorage.setItem('usuario_logueado', 'invitado');
    // Lo mandamos directo a la tienda
    window.location.href = 'index.html';
});