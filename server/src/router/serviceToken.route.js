import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/service-token', (req, res) => {
  const hdr = req.get('X-Service-Secret');
  console.log('Header recibido:', hdr);
  console.log('Esperado (env):', process.env.N8N_WEBHOOK_SECRET);
  
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

export default router;