import { Consultation } from "../../Models/Consultation.js";

export const showConsultationController = async (request, response) => {
    const patient_Id = request.params.patientId;
    const consultation = await Consultation.findAll({
        where: {
            patient_id: patient_Id
        },
        order: [
            ['fecha', 'DESC']
        ]
    })
    return response.status(200).json(consultation);
}
