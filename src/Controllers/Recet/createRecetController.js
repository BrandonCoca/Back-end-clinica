import { Recet } from "../../Models/Recet.js";

export const createRecetController = async (request, response) => {
    const consultation_Id = request.params.consultationId;
    const { medicamento, dosis } = request.body;
    if (!medicamento || !dosis) {
        return response.status(401).json({ message: 'Todos los campos son requeridos' });
    }
    const medicamentoRegex = /^[a-zA-Z0-9\s/+-ñÑáéíóúÁÉÍÓÚüÜ]{1,}$/;
    if (!medicamentoRegex.test(medicamento)) {
        return response.status(401).json({ message: "El medicamento debe tener al menos 1 caracter y solo puede contener letras, números y espacios." });
    }
    const dosisRegex = /^[a-zA-Z0-9\s/+-ñÑáéíóúÁÉÍÓÚüÜ]{1,}$/;
    if (!dosisRegex.test(dosis)) {
        return response.status(401).json({ message: "La dosis debe tener al menos 1 caracter y solo puede contener letras, números y espacios." });
    }
    const recet = await Recet.create({
        medicamento: medicamento,
        dosis: dosis,
        consultation_id: consultation_Id
    });
    return response.status(201).json({});
}