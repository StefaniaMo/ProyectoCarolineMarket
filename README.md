# Caroline Market - E-commerce de Ropa, Joyería y Electrónica

Bienvenido a **Caroline Market**! Una tienda de prueba, moderna, rápida y minimalista orientada a la venta de ropa, accesorios y electrónica. Este proyecto fue desarrollado enfocándose en una experiencia de usuario fluida y sencilla con un diseño responsivo elegante y una arquitectura de código JavaScript limpia y modular.

---
## Características Principales

* **Catálogo Dinámico:** Renderizado de productos consumidos en tiempo real desde una API externa, organizados por categorías y con precios formateados para que se vean sólo dos decimales.
* **Carrito de Compras Funcional:**  Con la opción de agregar producto desde la imagen y quitar productos desde el carrito.
    * Cálculo automático del total de dinero y contador de productos en el header.
    * Persistencia de datos mediante `localStorage` para no perder la compra al recargar.
    * Validación para evitar avanzar al checkout si el carrito está vacío.

* **Sistema de Autenticación Flexible (Compra sin registrarse):**
    * **Registro e Inicio de Sesión:** Validación de correos existentes y control de credenciales. Saludo personalizado con Nombre y Apellido en la barra superior al iniciar sesión.
    * **Acceso como Invitado:** Permite a los usuarios recorrer la tienda y realizar compras sin necesidad de registrarse previamente, delegando la captura de datos para el final del proceso.
* **Diseño Elegante e Interfaz Limpia:** Desarrollado con **Bootstrap 5** y estilos CSS personalizados enfocados en el minimalismo y la adaptabilidad móvil.

---

## Tecnologías Utilizadas

* **HTML5** - Estructura semántica de las vistas.
* **CSS3** - Estilos personalizados con variables, centrado dinámico y efectos visuales (`auth.css`).
* **Bootstrap 5** - Framework para el diseño responsive y componentes como el menú lateral (Offcanvas) del carrito.
* **JavaScript (ES6+)** - Lógica del negocio modularizada utilizando `import` y `export` de módulos.
* **LocalStorage** - Persistencia local de la sesión del usuario y el estado del carrito.

---

## Estructura del Proyecto

El código está organizado bajo el principio de separación de responsabilidades:

```text
├── index.html                # Página de inicio
├── allProducts.html          # Vista de todos los productos 
├── login.html                # Formulario de inicio de sesión
├── registro.html             # Formulario de creación de cuenta
├── checkout.html             # Formulario de envio 
├── producto.html             # Vista detallada del producto 
├── css/
│   ├── styles.css            # Estilos globales de la tienda
│   └── auth.css              # Estilos exclusivos de las pantallas de acceso (formularios centrados)
└── js/
    ├── app.js                # Orquestador principal de la página de inicio
    ├── all-products-view.js  # Lógica exclusiva de la vista del catálogo completo
    ├── api.js                # Gestión de peticiones asíncronas (Fetch) a la API de productos
    ├── auth.js               # El "motor" de usuarios (login, registro, sesiones)
    ├── login.js              # Maneja la lógica del formulario de la vista de login
    ├── registro.js           # Maneja la lógica del formulario de la vista de registro
    ├── carrito.js            # Lógica matemática y de almacenamiento del carrito
    └── ui.js                 # Manipulación del DOM (renderizar tarjetas, carrito y estados del header)
└── logo/                     # Imagen del banner central    