import { Diagnostic } from '../../Models/Diagnostic.js';

/**
 * Controlador para crear un nuevo diagnóstico
 * POST /api/v1/consultas/:consultationId/diagnosticos
 * 
 * Guarda el código CIE-10 y su descripción directamente en la tabla diagnostics
 * No requiere que el código exista previamente en una tabla cie10
 */
export const createDiagnosticController = async (request, response) => {
    try {
        const { consultationId } = request.params;
        const { codigo, descripcion } = request.body;

        // Validar que se proporcionen los datos requeridos
        if (!codigo || !descripcion) {
            return response.status(400).json({
                success: false,
                message: 'El código y la descripción del CIE-10 son requeridos'
            });
        }

        // Limpiar y normalizar el código
        const cleanCode = codigo.trim().toUpperCase();

        // Validar formato básico del código CIE-10
        if (!/^[A-Z]\d{2}(\.\d{1,2})?$/.test(cleanCode)) {
            return response.status(400).json({
                success: false,
                message: 'Formato de código CIE-10 inválido. Debe ser como: A00, A00.1, E11.9'
            });
        }

        // Crear el diagnóstico con el código y descripción proporcionados
        const diagnostic = await Diagnostic.create({
            codigo: cleanCode,
            descripcion: descripcion.trim(),
            consultation_id: consultationId
        });

        return response.status(201).json({
            success: true,
            message: 'Diagnóstico creado exitosamente',
            data: diagnostic
        });

    } catch (error) {
        console.error('Error en createDiagnosticController:', error);
        return response.status(500).json({
            success: false,
            message: 'Error al crear el diagnóstico',
            error: error.message
        });
    }
};

/**
 * Controlador para listar diagnósticos de una consulta
 * GET /api/v1/consultas/:consultationId/diagnosticos
 */
export const listDiagnosticsController = async (request, response) => {
    try {
        const { consultationId } = request.params;

        const diagnostics = await Diagnostic.findAll({
            where: {
                consultation_id: consultationId
            },
            order: [['id', 'ASC']]
        });

        return response.status(200).json({
            success: true,
            data: diagnostics,
            total: diagnostics.length
        });

    } catch (error) {
        console.error('Error en listDiagnosticsController:', error);
        return response.status(500).json({
            success: false,
            message: 'Error al obtener los diagnósticos',
            error: error.message
        });
    }
};
