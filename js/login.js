import { loginUsuario } from './auth.js';

const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();

        // Capturamos las credenciales
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Llamamos al motor para verificar
        const resultado = loginUsuario(email, password);

        if (resultado.exito) {
            alert(resultado.mensaje); // "¡Bienvenido de vuelta!"
            
            // Mandamos al usuario directamente a la tienda principal
            window.location.href = 'index.html'; 
        } else {
            alert(resultado.mensaje); // "Correo o contraseña incorrectos."
        }
    });
}

document.getElementById('btn-invitado')?.addEventListener('click', () => {
    // Guardamos 'invitado' en el localStorage para avisarle a la tienda
    localStorage.setItem('usuario_logueado', 'invitado');
    
    // Lo mandamos directo a la tienda
    window.location.href = 'index.html';
});