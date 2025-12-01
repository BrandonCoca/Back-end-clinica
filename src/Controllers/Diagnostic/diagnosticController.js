import { Diagnostic } from '../../Models/Diagnostic.js';

/**
 * Controlador para crear un nuevo diagnóstico
 * POST /api/v1/consultas/:consultationId/diagnosticos
 * 
 * El código CIE-10 debe ser validado previamente usando el middleware validateCIE10Middleware
 */
export const createDiagnosticController = async (request, response) => {
    try {
        const { consultationId } = request.params;
        const { codigo } = request.body;

        // El middleware validateCIE10Middleware ya validó el código y guardó la info
        const cie10Info = request.cie10Info;

        // Crear el diagnóstico con el código validado
        const diagnostic = await Diagnostic.create({
            codigo: codigo.trim().toUpperCase(),
            descripcion: cie10Info?.description || null, // Guardar la descripción si existe
            consultation_id: consultationId
        });

        return response.status(201).json({
            success: true,
            message: 'Diagnóstico creado exitosamente',
            data: {
                diagnostic,
                cie10_info: cie10Info // Información adicional del CIE-10
            }
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
            }
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
