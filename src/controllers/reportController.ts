import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';

export const getTopCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sql = `
            SELECT u.id, u.name, u.email, COUNT(o.id) as total_orders, SUM(o.total_amount) as total_spent
            FROM users u
            JOIN orders o ON u.id = o.user_id
            GROUP BY u.id
            ORDER BY total_orders DESC
            LIMIT 5
        `;
        const result = await query(sql);
        res.json({ status: 'sukses', data: result.rows });
    } catch (error) {
        next(error);
    }
};
