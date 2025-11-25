import { Patient } from "../../Models/Patient.js";
import { hash } from "../../Auth/Services/encryptionService.js";

export const updatePatientController = async (request, response) => {
    const patientId = request.params.id;
    const patient = await Patient.findByPk(patientId);

    const { nombre, ci, fecha_nac, genero, cel } = request.body;
    if (!nombre || !ci || !fecha_nac || !genero || !cel) {
        return response.status(401).json({ message: 'Todos los campos son requeridos' });
    }
    const nombreRegex = /^[A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü]+(?:\s[A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü]+)+$/;
    if (!nombreRegex.test(nombre)) {
        return response.status(401).json({ message: "Coloque nombre completo." });
    }
    const ciRegex = /^\d{5,10}([-\s]?[0-9A-Z]{1,3})?$/;
    if (!ciRegex.test(ci)) {
        return response.status(401).json({ message: "El CI debe tener entre 5 y 10 caracteres y solo puede contener números." });
    }
    const celRegex = /^[67]\d{7}$/;
    if (!celRegex.test(cel)) {
        return response.status(401).json({ message: "El número de celular debe tener 8 dígitos" });
    }

    const nombre_hashed = hash(nombre);
    const ci_hashed = hash(ci);
    const posibleDuplicado = await Patient.findOne({
        where: { ci_hash: ci_hashed }
    });
    if (posibleDuplicado && posibleDuplicado.id !== patient.id) {
        return response.status(401).json({ message: "Ese carnet de identidad ya está registrado" });
    }

    patient.nombre = nombre;
    patient.nombre_hash = nombre_hashed;
    patient.ci = ci;
    patient.ci_hash = ci_hashed;
    patient.fecha_nac = fecha_nac;
    patient.genero = genero;
    patient.cel = cel;

    await patient.save();

    return response.status(200).json({});
}