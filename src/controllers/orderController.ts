import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const client = await pool.connect();
    try {
        const userId = (req as AuthRequest).user.id;
        const { items_total } = req.body;

        await client.query('BEGIN');

        const seqResult = await client.query(
            "SELECT current_val FROM sequences WHERE name = 'order_seq' FOR UPDATE"
        );

        let nextVal = 1;
        if (seqResult.rows.length > 0) {
            nextVal = seqResult.rows[0].current_val + 1;
        }

        await client.query("UPDATE sequences SET current_val = $1 WHERE name = 'order_seq'", [nextVal]);

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const runningNumber = `ORD-${dateStr}-${String(nextVal).padStart(4, '0')}`;

        const orderSql = 'INSERT INTO orders (user_id, order_number, total_amount) VALUES ($1, $2, $3) RETURNING *';
        const orderResult = await client.query(orderSql, [userId, runningNumber, items_total]);

        await client.query('COMMIT');

        res.status(201).json({ status: 'sukses', data: orderResult.rows[0] });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};
