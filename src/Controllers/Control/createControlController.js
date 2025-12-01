import { Control } from "../../Models/Control.js";

export const createControlController = async (request, response) => {
    const consultation_Id = request.params.consultationId;
    const { descripcion } = request.body;
    if (!descripcion) {
        return response.status(401).json({ message: 'Todos los campos son requeridos' });
    }
    const descripcionRegex = /^[a-zA-Z0-9\s/+-ñÑáéíóúÁÉÍÓÚüÜ]{1,}$/;
    if (!descripcionRegex.test(descripcion)) {
        return response.status(401).json({ message: "El control debe tener al menos 1 caracter y solo puede contener letras, números y espacios." });
    }
    const control = await Control.create({
        descripcion,
        consultation_id: consultation_Id
    });
    return response.status(201).json(control);
}
