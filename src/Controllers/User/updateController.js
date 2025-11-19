import { User } from "../../Models/User.js";

export const updateController = async (request, response) => {
    const userId = request.params.id;
    const user = await User.findByPk(userId)
    const { name, rol } = request.body;

    user.name = name;
    user.rol = rol;
    user.save();

    return response.status(200).json({});
};         