import { Professional } from "../../Models/Professional.js";

export const updateProfessionalController = async (request, response) => {
    const professionalId = request.params.id;
    const professional = await Professional.findByPk(professionalId);
    const { matricula, nombre, especialidad, cel } = request.body;
    const posibleDuplicado = await Professional.findOne({
        where: { matricula: matricula }
    });
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
    if (posibleDuplicado && posibleDuplicado.id !== professional.id) {
        return response.status(401).json({ message: "Ese número de matrícula ya está registrado" });
    }
    professional.matricula = matricula;
    professional.nombre = nombre;
    professional.especialidad = especialidad;
    professional.cel = cel;
    await professional.save();
    return response.status(200).json({});
}
