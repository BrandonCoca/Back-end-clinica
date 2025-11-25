import { Professional } from "../../Models/Professional.js";

export const indexProfessionalController = async (request, response) => {

    const page = parseInt(request.query.page) || 1;
    response.json(await Professional.paginate(5, page));
}