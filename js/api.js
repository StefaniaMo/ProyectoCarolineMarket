const URL_API = 'https://fakestoreapi.com/products';

export async function obtenerProductos() {
    try {
        const respuesta = await fetch(URL_API);
        // Si la respuesta no es ok (ej. error 404 o 500), lanzamos un error
        if (!respuesta.ok) {
            throw new Error('Error al conectar con la API');
        }
        
        const productos = await respuesta.json();
        return productos; // Devolvemos los datos para que app.js los reciba
    } catch (error) {
        console.error("Hubo un problema con el fetch:", error);
        return []; // Devolvemos un array vacío para que la app no se rompa si falla internet
    }
}