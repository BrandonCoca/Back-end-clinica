import { User } from '../../Models/User.js';
import { PasswordService } from '../../Auth/Services/PasswordService.js';
import { hash } from '../../Auth/Services/encryptionService.js';

export const createUserController = async (request, response) => {

    const { name, name_hash, password, rol, estado, ultima_conexion } = request.body;

    const name_hashed = hash(name_hash);
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
        password: await PasswordService.encrypt(password),
        rol: rol,
        estado: estado,
        ultima_conexion: ultima_conexion
    });

    const resultado = user.toJSON();
    delete resultado.name_hash;


    console.log(user);

}