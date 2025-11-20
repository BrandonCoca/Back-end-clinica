import cors from 'cors';
import { env } from './Shared/env.js';

const allowedOrigins = [
    'http://127.0.0.1:8080',
    'http://localhost:8080',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('Not allowed by CORS'));
        }
        return callback(null, true);
    }
}

export default cors(corsOptions);