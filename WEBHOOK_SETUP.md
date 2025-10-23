# 🔔 Configuración de Webhook para MercadoPago

Para que MercadoPago pueda notificar a tu servidor sobre los cambios de estado de pagos (aprobado, rechazado, etc.), necesitas exponer tu servidor local a internet usando un túnel.

## Opción 1: Cloudflare Tunnel (Recomendado - Gratis y Permanente)

### Instalación:

```powershell
# Descargar cloudflared para Windows
# Ir a: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
# O usar winget:
winget install --id Cloudflare.cloudflared
```

### Uso:

```powershell
# En una terminal, navega a la carpeta del servidor
cd C:\Users\aceof\catfecito-entredevs\catfecito\server

# Inicia el túnel apuntando al puerto 5000
cloudflared tunnel --url http://localhost:5000
```

Verás una salida como:
```
Your quick Tunnel has been created! Visit it at:
https://random-words-1234.trycloudflare.com
```

### Configurar variables de entorno:

Copia la URL que te dio cloudflared y configúrala en tu archivo `.env`:

```env
# Backend URL (la URL del túnel)
BACKEND_URL=https://random-words-1234.trycloudflare.com

# Frontend URL (local)
FRONTEND_URL=http://localhost:5173

# MercadoPago
MP_ACCESS_TOKEN=tu_access_token
CURRENCY_ID=ARS
```

**Importante:** La URL de cloudflared cambia cada vez que reinicias el túnel (a menos que configures un túnel permanente con cuenta de Cloudflare).

---

## Opción 2: ngrok (Fácil pero requiere cuenta)

### Instalación:

1. Descargar desde https://ngrok.com/download
2. Crear cuenta gratuita en https://dashboard.ngrok.com/signup
3. Copiar tu authtoken desde https://dashboard.ngrok.com/get-started/your-authtoken
4. Configurar:

```powershell
ngrok authtoken TU_AUTHTOKEN_AQUI
```

### Uso:

```powershell
# Iniciar túnel al puerto 5000
ngrok http 5000
```

Verás una salida como:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:5000
```

### Configurar variables de entorno:

```env
# Backend URL (la URL de ngrok)
BACKEND_URL=https://abc123.ngrok-free.app

# Frontend URL (local)
FRONTEND_URL=http://localhost:5173
```

---

## Opción 3: localtunnel (Más simple pero menos estable)

### Instalación:

```powershell
npm install -g localtunnel
```

### Uso:

```powershell
lt --port 5000 --subdomain catfecito
```

URL generada: `https://catfecito.loca.lt`

**Problema:** Primera visita requiere hacer clic en "Continue" en una página intermedia, lo cual puede fallar para webhooks automáticos.

---

## 🧪 Probar el Webhook

### 1. Iniciar el túnel:

```powershell
# Terminal 1: Iniciar cloudflared
cloudflared tunnel --url http://localhost:5000
```

### 2. Actualizar .env con la URL del túnel:

```env
BACKEND_URL=https://tu-url-del-tunnel.trycloudflare.com
```

### 3. Reiniciar el servidor backend:

```powershell
# Terminal 2: Reiniciar servidor
cd server
npm run dev
```

### 4. Verificar que el endpoint está accesible:

Abre en el navegador:
```
https://tu-url-del-tunnel.trycloudflare.com/api/payments/webhook
```

Deberías ver: `{"error":"Method not allowed"}` (porque no es POST)

### 5. Realizar una compra de prueba:

1. Agrega productos al carrito
2. Ve a `/checkout`
3. Completa los datos de envío
4. Haz clic en "Continuar al pago"
5. Haz clic en el botón de MercadoPago
6. Completa el pago con tarjeta de prueba

**Tarjetas de prueba para Argentina:**
- **Aprobada:** 
  - Número: `5031 7557 3453 0604`
  - CVV: `123`
  - Vencimiento: Cualquier fecha futura
  - Nombre: APRO
  - DNI: 12345678

- **Rechazada:**
  - Número: `5031 4332 1540 6351`
  - CVV: `123`
  - Vencimiento: Cualquier fecha futura
  - Nombre: OTHE
  - DNI: 12345678

### 6. Verificar en la consola del servidor:

Deberías ver logs como:
```
🔔 Webhook recibido de MercadoPago
📦 Payment data: {...}
✅ Pago aprobado para orden #123
```

---

## 📋 Checklist de Verificación

- [ ] Túnel iniciado y funcionando
- [ ] Variable `BACKEND_URL` actualizada en `.env`
- [ ] Servidor backend reiniciado
- [ ] Endpoint `/api/payments/webhook` accesible públicamente
- [ ] Pago de prueba realizado
- [ ] Webhook recibido en el servidor (revisar logs)
- [ ] Stock decrementado
- [ ] Carrito vaciado
- [ ] Orden actualizada a `paid`
- [ ] Redirección a `/profile/orders` con mensaje de éxito

---

## 🐛 Troubleshooting

### El webhook no se recibe:

1. Verifica que la URL del túnel esté actualizada en `.env`
2. Revisa los logs del servidor backend
3. Verifica que MercadoPago pueda acceder a tu URL (sin VPN/firewall)
4. Usa las credenciales de prueba correctas

### El botón de MercadoPago aparece duplicado:

- Esto puede pasar en desarrollo por React Strict Mode
- En producción no debería ocurrir
- La `key={preferenceId}` debería ayudar a forzar re-mount limpio

### El pago se aprueba pero el stock no se decrementa:

- Revisa los logs del webhook en el servidor
- Verifica que el `order_id` coincida
- Chequea que la transacción en la BD se complete correctamente

---

## 🚀 Producción

En producción, no uses túneles temporales. Despliega tu backend en:
- Heroku
- Railway
- Render
- Vercel (con Serverless Functions)
- AWS / Azure / GCP

Y usa la URL real de producción en `BACKEND_URL`.
