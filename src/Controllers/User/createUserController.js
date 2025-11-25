import { User } from '../../Models/User.js';
import { PasswordService } from '../../Auth/Services/PasswordService.js';
import { hash } from '../../Auth/Services/encryptionService.js';

export const createUserController = async (request, response) => {

    const { name, password, rol } = request.body;

    if (!name || !password || !rol) {
        return response.status(401).json({ message: 'Todos los campos son requeridos' });
    }
    const nameRegex = /^[a-zA-Z0-9\s_ñÑáéíóúÁÉÍÓÚüÜ]{4,50}$/;
    if (!nameRegex.test(name)) {
        return response.status(401).json({ message: "El nombre debe tener entre 4 y 50 caracteres y solo puede contener letras, números y espacios." });
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        return response.status(401).json({ message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial" });
    }
    const name_hashed = hash(name);
    const cantidad = await User.count();
    if (cantidad > 0) {
        const existente = await User.findOne({
            where: { name_hash: name_hashed }
        });
        if (existente) {
            return response.status(401).json({ message: 'El usuario ya está registrado' });
        }
    }
    const existente = await User.findOne({
        where: { name_hash: name_hashed }
    });
    if (existente) {
        return response.status(401).json({ message: 'El usuario ya está registrado' });
    }

    const user = await User.create({
        name: name,
        name_hash: name_hashed,
        password: await PasswordService.encrypt(password),
        rol: rol,
        estado: true,
        ultima_conexion: new Date(),
    });

    return response.status(201).json({
    });


}