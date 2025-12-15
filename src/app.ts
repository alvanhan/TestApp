import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';

import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import externalRoutes from './routes/externalRoutes';
import reportRoutes from './routes/reportRoutes';
import { startScheduler } from './services/scheduler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/external', externalRoutes);
app.use('/reports', reportRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('API Skill Test Berjalan. Tersedia: /auth, /orders, /external, /reports');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: err.message });
});

startScheduler();

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

export default app;
