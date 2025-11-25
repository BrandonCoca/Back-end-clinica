import { Professional } from "../../Models/Professional.js";

export const showProfessionalController = async (request, response) => {
    const professionalId = request.params.id;
    const professional = await Professional.findOne({
        where: {
            id: professionalId
        }
    })

    return response.json(professional);
}