import { User } from "../../Models/User.js";
import { hash } from "../../Auth/Services/encryptionService.js";

export const updateController = async (request, response) => {
    const userId = request.params.id;
    const user = await User.findByPk(userId)
    const { name, rol, estado } = request.body;
    if (!name || !rol || !estado) {
        return response.status(401).json({ message: 'Todos los campos son requeridos' });
    }
    const nameRegex = /^[a-zA-Z0-9\s_ñÑáéíóúÁÉÍÓÚüÜ]{4,50}$/;
    if (!nameRegex.test(name)) {
        return response.status(401).json({ message: "El nombre debe tener entre 4 y 50 caracteres y solo puede contener letras, números y espacios." });
    }
    const name_hashed = hash(name);
    const posibleDuplicado = await User.findOne({
        where: { name_hash: name_hashed }
    });
    if (posibleDuplicado && posibleDuplicado.id !== user.id) {
        return response.status(401).json({ message: "Ese nombre de usuario ya está en uso" });
    }
    user.name = name;
    user.name_hash = name_hashed;
    user.rol = rol;
    user.estado = estado;

    await user.save();

    return response.status(200).json({});
};         