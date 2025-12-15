import { Router } from 'express';
import { getTopCustomer } from '../controllers/reportController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/top-customers', authenticateToken, getTopCustomer);

export default router;
