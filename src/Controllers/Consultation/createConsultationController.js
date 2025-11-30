import { Consultation } from "../../Models/Consultation.js";
import { Patient } from "../../Models/Patient.js";
import { Professional } from "../../Models/Professional.js";
import { Quote } from "../../Models/Quote.js";

export const createConsultationController = async (request, response) => {
    const { fecha, motivo, descripcion, professional_id, patient_id, quote_id } = request.body;
    if (!motivo || !descripcion || !professional_id || !patient_id) {
        return response.status(401).json({ message: 'Todos los campos son requeridos' });
    }
    const motivoRegex = /^[a-zA-Z0-9\s/+-ñÑáéíóúÁÉÍÓÚüÜ]{1,}$/;
    if (!motivoRegex.test(motivo)) {
        return response.status(401).json({ message: "El motivo debe tener al menos 1 caracter y solo puede contener letras, números y espacios." });
    }
    const consultaRegex = /^[a-zA-Z0-9\s/+-ñÑáéíóúÁÉÍÓÚüÜ]{1,}$/;
    if (!consultaRegex.test(descripcion)) {
        return response.status(401).json({ message: "La descripción debe tener al menos 1 caracter y solo puede contener letras, números y espacios." });
    }
    const consultation = await Consultation.create({
        fecha: new Date(),
        motivo: motivo,
        descripcion: descripcion,
        professional_id: professional_id,
        patient_id: patient_id,
        quote_id: quote_id
    });
    return response.status(201).json({});
}
