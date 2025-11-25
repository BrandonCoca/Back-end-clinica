import { Patient } from '../../Models/Patient.js';

export const indexPatientController = async (request, response) => {
    const page = parseInt(request.query.page) || 1;

    response.json(await Patient.paginate(5, page));
}
