# CatFecito — E‑commerce

Tienda online de cafés y accesorios. Frontend en Vercel y backend en Railway, pagos con Mercado Pago y base de datos PostgreSQL.

- Live: https://catfecito.vercel.app

## Tecnologías
- Frontend: React + Vite, React Router, Axios
- Backend: Node.js + Express, pg (PostgreSQL), JWT, CORS
- Pagos: Mercado Pago (preferencias + webhook)
- Infra: Vercel (FE), Railway (BE + Postgres)

## Funcionalidades
- Catálogo y detalle de productos
- Carrito persistente y cálculo de subtotal
- Checkout con Mercado Pago (success/pending/failure)
- Webhook para actualización de órdenes
- Panel responsive

## Deploy
- Frontend: Vercel (SPA fallback con `vercel.json`)
- Backend: Railway (conexión interna a Postgres y `sslmode=require`)
- DB: PostgreSQL en Railway


## Ejecutar en local
```bash
# Frontend
cd client
npm i
npm run dev

# Backend
cd server
npm i
npm run dev
```

