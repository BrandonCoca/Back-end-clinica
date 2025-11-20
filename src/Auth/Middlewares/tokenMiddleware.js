import { TokenService } from '../../Auth/Services/TokenService.js';
import jwt from 'jsonwebtoken';

export const tokenMiddleware = (request, response, next) => {
    const token = request.headers.authorization;
    if (!TokenService.isValid(token)) {
        return response.status(403).json({ message: 'Credenciales inválidas' });
    }
    const aux = token.startsWith('Bearer ')
        ? token.split(' ')[1]
        : token;
    const decoded = jwt.verify(aux, process.env.JWT_SECRET_KEY);
    request.userId = decoded.userId;
    next();
};