import { User } from '../../Models/User.js';
import { PasswordService } from '../../Auth/Services/PasswordService.js';
import { hash } from '../../Auth/Services/encryptionService.js';

export const createUserController = async (request, response) => {

    const { name, password, rol } = request.body;
    const nameRegex = /^[a-zA-Z0-9]+/;
    if (!nameRegex.test(name)) {
        return response.status(401).json({ message: "Credenciales incorrectas" });
    }
    const strongPasswordRegex = /^.+$/;
    if (!strongPasswordRegex.test(password)) {
        return response.status(401).json({ message: "Credenciales incorrectas" });
    }
    if (!name || !password || !rol) {
        return response.status(400).json({
            message: 'Todos los campos son requeridos',
        });
    }
    const name_hashed = hash(name);
    const existente = await User.findOne({
        where: { name_hash: name_hashed }
    });
    if (existente) {
        return response.status(400).json({
            error: 'El carnet de identidad ya está registrado',
            codigo: 'CI_DUPLICADO'
        });
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