import { Router } from 'express';
import { getExternalPosts } from '../controllers/externalController';

const router = Router();

router.get('/posts', getExternalPosts);

export default router;
