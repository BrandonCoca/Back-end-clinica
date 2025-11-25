import { User } from "../../Models/User.js";

export const deleteUserController = async (request, response) => {
    const userId = request.params.id;
    const user = await User.findByPk(userId);
    const { estado } = request.body;
    user.estado = estado;
    await user.save();
    // User.destroy({
    //     where: {
    //         id: userId
    //     }
    // })
    // response.status(204).json({});
    response.status(200).json({});
}   