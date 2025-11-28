# CatFecito — E‑commerce Full Stack

> Plataforma completa de comercio electrónico con gestión de stock, pagos reales y automatización de procesos.

![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![Node](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![n8n](https://img.shields.io/badge/-n8n-FF6584?style=flat&logo=n8n&logoColor=white)

---

## Stack Tecnológico

| Área | Tecnologías |
| :--- | :--- |
| **Frontend** | React + Vite, React Router, Axios, CSS Modules. |
| **Backend** | Node.js + Express, JWT Auth, MVC Architecture. |
| **Base de Datos** | PostgreSQL (Alojada en Railway). |
| **Pagos** | **Mercado Pago SDK** (Preferencias + Webhooks). |
| **Infraestructura** | Vercel (Front), Railway (Back), Cloudinary (Imágenes). |
| **Automatización** | **n8n** (Emails transaccionales con Resend & DNS custom). |

---

## Tecnologías
- Frontend: React + Vite, React Router, Axios
- Backend: Node.js + Express, pg (PostgreSQL), JWT, CORS
- Pagos: Mercado Pago (preferencias + webhook)
- Infra: Vercel (FE), Railway (BE + Postgres), Cloudinary(almacenamiento externo para imágenes,), n8n(emails de ordenes)

---

## Funcionalidades

- **Catálogo y detalle de productos:** Navegación fluida y visualización de artículos.
- **Login / Register:** Autenticación segura de usuarios.
- **Panel de administración:** Interfaz para agregar, editar y eliminar productos (CRUD).
- **Carrito persistente:** Cálculo automático de subtotal y guardado de selección.
- **Checkout con Mercado Pago:** Gestión de estados de pago (success/pending/failure).
- **Webhook:** Actualización automática de órdenes tras el pago.
- **Panel de Cliente:** Historial de compras y seguimiento del estado de pedidos.
- **Diseño Responsive:** Adaptable a móviles y escritorio.

---

## Despliegue (Deploy)
El proyecto cuenta con una arquitectura de despliegue profesional:
- **Frontend:** Vercel (Configurado como SPA).
- **Backend:** Railway (Variables de entorno seguras y SSL).
- **Dominio:** Configuración de DNS personalizados para `.lat` y verificación de correo.

---

## Cómo probar el pago en la pagina

La app ya está configurada con credenciales de prueba. Solo necesitas usar una tarjeta de test de Mercado Pago:

1. Entra a: https://catfecito.vercel.app
2. Añade productos al carrito y procede al checkout.
3. Elige pagar con tarjeta (Mercado Pago).
4. Usa estos datos (pago aprobado):
   - Número (Visa): 4509 9535 6623 3704
   - Vencimiento: 11/25
   - CVV: 123
   - Titular: APRO
   - Documento: 12345678
5. Confirma el pago. Serás redirigido a /checkout?payment=success.

Opcional (otros estados):
- Rechazado: usa titular OTRO y cualquier otro CVV.
- Pendiente: MasterCard 5031 7557 3453 0604 (mismos demás datos).

No necesitas modificar ningún .env ni credenciales en la versión desplegada; todo está en modo sandbox.

---

## Crear usuario de prueba Mercado Pago (si necesitas uno porqueno procesa el pago con la tarjeta)

1. Ir a: https://www.mercadopago.com.ar/developers → Tu usuario → Usuarios de prueba.
2. Click “Crear usuario de prueba”.
3. Sitio: MLA (Argentina). Rol: Comprador.
4. Se generará automáticamente:
   - ID (numérico)
   - Email (p. ej. test_user_1234567890123@testuser.com)
   - Contraseña
5. Logueate con el email y la contraseña del usuario de prueba en Mercado Pago. Luego realiza el pago de los productos.
6. Si te pide “código enviado al correo” (ese correo es de prueba, no existe), ingresa los últimos 6 dígitos del ID del usuario de prueba que creaste en el paso 4.


## Ejecutar en local (enlaces rápidos)

- Backend: ver [BACKEND_INSTRUCTIONS.md](./BACKEND_INSTRUCTIONS.md)
- Frontend: ver [FRONTEND_INSTRUCTIONS.md](./FRONTEND_INSTRUCTIONS.md)
