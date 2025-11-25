import { Patient } from "../../Models/Patient.js";

export const showPatientController = async (request, response) => {
    const patientId = request.params.id;
    const patient = await Patient.findOne({
        where: {
            id: patientId
        }
    })

    return response.json(patient);
}