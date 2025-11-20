import { User } from "../../Models/User.js";

const showProfileController = async (request, response) => {
    const userId = request.userId;
    const userProfile = await User.findByPk(userId);

    if (!userProfile) {
        return response.status(404).json({ message: 'Perfil de usuario no encontrado' });
    }
    const dataForNav = {
        nombre: userProfile.name,
        role: userProfile.rol,
        ultima_conexion: userProfile.ultima_conexion
    };
    return response.status(200).json(dataForNav);
}

export { showProfileController };