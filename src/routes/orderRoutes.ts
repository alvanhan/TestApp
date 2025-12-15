import { Router } from 'express';
import { createOrder } from '../controllers/orderController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createOrder);

export default router;
