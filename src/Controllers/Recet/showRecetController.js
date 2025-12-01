import { Recet } from "../../Models/Recet.js";

export const showRecetController = async (request, response) => {
    const consultation_Id = request.params.consultationId;
    const recet = await Recet.findAll({
        where: {
            consultation_id: consultation_Id
        }
    });
    return response.status(200).json({ recet });
}