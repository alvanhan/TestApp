import { Router } from 'express';
import { register, loginEmail, loginPhone } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login-email', loginEmail);
router.post('/login-phone', loginPhone);

export default router;
