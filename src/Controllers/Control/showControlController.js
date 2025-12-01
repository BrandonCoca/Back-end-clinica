import { Control } from "../../Models/Control.js";

export const showControlController = async (request, response) => {
    const consultation_Id = request.params.consultationId;
    const control = await Control.findAll({
        where: {
            consultation_id: consultation_Id
        }
    })
    return response.status(200).json(control);
}