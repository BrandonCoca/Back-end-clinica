import crypto from 'crypto';

const SECRET_KEY = process.env.ENCRYPTION_KEY || '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text) {
    if (!text) return null;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        ALGORITHM,
        Buffer.from(SECRET_KEY, 'hex').slice(0, 32),
        iv
    );

    let encrypted = cipher.update(String(text), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedData) {
    if (!encryptedData) return null;

    try {
        const parts = encryptedData.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];

        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            Buffer.from(SECRET_KEY, 'hex').slice(0, 32),
            iv
        );
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Error desencriptando:', error.message);
        return null;
    }
}

export function hash(text) {
    if (!text) return null;

    const hash = crypto.createHash('sha256');
    hash.update(String(text));
    return hash.digest('hex');
}
