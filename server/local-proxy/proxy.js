import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PROXY_PORT || 8080;

// Proxy /api/* -> backend (localhost:5000)
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
    logLevel: 'warn',
  })
);

// health
app.get('/', (req, res) => res.send('local-proxy ok'));

app.listen(PORT, () => {
  console.log(`Local proxy listening on http://localhost:${PORT}`);
});