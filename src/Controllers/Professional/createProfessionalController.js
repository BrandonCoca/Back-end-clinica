import { Professional } from "../../Models/Professional.js";

export const createProfessionalController = async (request, response) => {
    const { matricula, nombre, especialidad, cel } = request.body;
    if (!matricula || !nombre || !especialidad || !cel) {
        return response.status(401).json({ message: 'Todos los campos son requeridos' });
    }
    const nombreRegex = /^[A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü]+(?:\s[A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü]+)+$/;
    if (!nombreRegex.test(nombre)) {
        return response.status(401).json({ message: "Coloque nombre completo." });
    }
    const celRegex = /^[67]\d{7}$/;
    if (!celRegex.test(cel)) {
        return response.status(401).json({ message: "El número de celular debe tener 8 dígitos" });
    }
    const cantidad = await Professional.count();
    if (cantidad > 0) {
        const existente = await Professional.findOne({
            where: { matricula: matricula }
        });
        if (existente) {
            return response.status(401).json({ message: 'El profesional ya está registrado' });
        }
    }
    const professional = await Professional.create({
        matricula: matricula,
        nombre: nombre,
        especialidad: especialidad,
        cel: cel
    });
    response.status(201).json({});
};
