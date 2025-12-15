import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'gagal', message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    jwt.verify(token, SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ status: 'gagal', message: 'Token tidak valid.' });
        }
        (req as AuthRequest).user = user;
        next();
    });
};
