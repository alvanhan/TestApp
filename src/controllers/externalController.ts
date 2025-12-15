import { Request, Response, NextFunction } from 'express';

export const getExternalPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if (!response.ok) {
            throw new Error(`External API Error: ${response.statusText}`);
        }
        const data = await response.json();
        res.json({ status: 'sukses', source: 'jsonplaceholder', data });
    } catch (error) {
        next(error);
    }
};
