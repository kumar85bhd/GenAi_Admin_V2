import { Router } from 'express';
import { adminGuard } from '../auth/adminGuard';

const router = Router();

// Apply admin guard to all routes in this router
router.use(adminGuard);

router.get('/users', (req, res) => {
  res.json({ message: 'Admin users list' });
});

export default router;
