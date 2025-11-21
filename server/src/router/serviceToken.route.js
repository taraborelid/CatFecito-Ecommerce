import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = Router();

// Middleware para validar service token
function validateServiceToken(req, res, next) {
  const auth = req.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'service') {
      return res.status(403).json({ message: 'Rol no autorizado' });
    }
    req.serviceUser = decoded;
    next();
  } catch (e) {
    return res.status(403).json({ message: 'Token inválido', error: e.message });
  }
}

router.post('/service-token', (req, res) => {
  const hdr = req.get('X-Service-Secret');
  if (!hdr || hdr !== (process.env.N8N_WEBHOOK_SECRET || '')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const token = jwt.sign(
    { role: 'service', email: process.env.ADMIN_EMAIL || 'admin@local' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.json({ token });
});

// Nueva ruta GET /api/internal/orders/:id (para n8n)
router.get('/orders/:id', validateServiceToken, async (req, res) => {
  const { id } = req.params;
  try {
    const orderRes = await pool.query(
      `SELECT o.*, u.email as user_email, u.name as user_name
       FROM orders o
       INNER JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    );
    if (orderRes.rowCount === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    const order = orderRes.rows[0];

    const itemsRes = await pool.query(
      `SELECT oi.*, p.name as product_name
       FROM order_items oi
       INNER JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      ...order,
      items: itemsRes.rows
    });
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener orden', error: e.message });
  }
});

export default router;