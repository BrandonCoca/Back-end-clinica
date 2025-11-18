import jwt from 'jsonwebtoken';
import { env } from '../../Shared/env.js';

export class TokenService {
    static isValid(authHeader) {
        if (!authHeader) { return false; }
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;
        if (!token) { return false; }
        try {
            jwt.verify(token, env('JWT_SECRET_KEY'));
            return true;
        } catch (error) {
            return false;
        }
    }
}