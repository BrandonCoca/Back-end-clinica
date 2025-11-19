import { User } from "../../Models/User.js";

export const deleteUserController = async (request, response) => {
    const userId = request.params.id;
    User.destroy({
        where: {
            id: userId
        }
    })
    response.status(204).json({});
}   