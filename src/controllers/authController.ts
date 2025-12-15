import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, phone, password, name } = req.body;
        if (!email || !phone || !password) throw new Error('Data tidak lengkap');

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (email, phone, password, name) VALUES ($1, $2, $3, $4) RETURNING id, email, name';

        const result = await query(sql, [email, phone, hashedPassword, name]);
        res.status(201).json({ status: 'sukses', data: result.rows[0] });
    } catch (error: any) {
        next(new Error(error.message));
    }
};

export const loginEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            res.status(401).json({ status: 'gagal', message: 'Kredensial tidak valid' });
            return;
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(401).json({ status: 'gagal', message: 'Kredensial tidak valid' });
            return;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
        res.json({ status: 'sukses', token });
    } catch (error) {
        next(error);
    }
};

export const loginPhone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phone, password, otp } = req.body;
        if (password) {
            const result = await query('SELECT * FROM users WHERE phone = $1', [phone]);
            if (result.rows.length === 0) return res.status(401).json({ message: 'Pengguna tidak ditemukan' });

            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ message: 'Password salah' });

            const token = jwt.sign({ id: user.id, phone: user.phone }, SECRET, { expiresIn: '1h' });
            return res.json({ status: 'sukses', token });
        }

        if (otp) {
            if (otp !== '1234') return res.status(401).json({ message: 'OTP tidak valid' });
            const result = await query('SELECT * FROM users WHERE phone = $1', [phone]);
            if (result.rows.length === 0) return res.status(401).json({ message: 'Pengguna tidak ditemukan' });

            const token = jwt.sign({ id: result.rows[0].id }, SECRET, { expiresIn: '1h' });
            return res.json({ status: 'sukses', token });
        }

        throw new Error('Harap sertakan password atau OTP');
    } catch (error) {
        next(error);
    }
};
