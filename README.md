# CatFecito — E‑commerce

Tienda online de cafés y accesorios. Frontend en Vercel y backend en Railway, pagos con Mercado Pago y base de datos PostgreSQL.

- Live: https://www.catfecito.lat/

Imagenes de demostración de la funcionalidades de la store:

- [CatFecito-demo](./catfecito-demo.pdf)

## Tecnologías
- Frontend: React + Vite, React Router, Axios
- Backend: Node.js + Express, pg (PostgreSQL), JWT, CORS
- Pagos: Mercado Pago (preferencias + webhook)
- Infra: Vercel (FE), Railway (BE + Postgres), Cloudinary(almacenamiento externo para imágenes,), n8n(emails de ordenes)

## Funcionalidades
- Catálogo y detalle de productos
- Login
- Register
- Panel de administración para agregar, editar y eliminar productos
- Carrito persistente y cálculo de subtotal
- Checkout con Mercado Pago (success/pending/failure)
- Webhook para actualización de órdenes
- Panel responsive

## Deploy
- Frontend: Vercel (SPA fallback con `vercel.json`)
- Backend: Railway (conexión interna a Postgres y `sslmode=require`)
- DB: PostgreSQL en Railway

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
