import { Router } from 'express';

const router = Router();

router.get('/config', (req, res) => {
  res.json({ message: 'Admin config' });
});

export default router;
