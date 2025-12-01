import cie10Service from '../Services/cie10Service.js';

/**
 * Middleware para validar que el código CIE-10 sea válido
 * antes de crear o actualizar un diagnóstico
 */
export const validateCIE10Middleware = async (request, response, next) => {
    try {
        const { codigo } = request.body;

        // Si no hay código en el body, pasar al siguiente middleware
        if (!codigo) {
            return response.status(400).json({
                success: false,
                message: 'El código CIE-10 es requerido'
            });
        }

        // Validar el formato del código
        const cleanCode = codigo.trim().toUpperCase();

        if (!/^[A-Z]\d{2}(\.\d{1,2})?$/.test(cleanCode)) {
            return response.status(400).json({
                success: false,
                message: 'Formato de código CIE-10 inválido. Debe ser como: A00, A00.1, E11.9'
            });
        }

        // Validar el código contra la API del CIE-10
        const result = await cie10Service.searchByCode(cleanCode);

        if (!result.valid) {
            return response.status(400).json({
                success: false,
                message: 'El código CIE-10 no es válido o no existe',
                details: result.error
            });
        }

        // Guardar la información del CIE-10 en el request para uso posterior
        request.cie10Info = result;

        // Normalizar el código en el body
        request.body.codigo = cleanCode;

        next();

    } catch (error) {
        console.error('Error en validateCIE10Middleware:', error);
        return response.status(500).json({
            success: false,
            message: 'Error al validar código CIE-10',
            error: error.message
        });
    }
};

/**
 * Middleware opcional: valida el código CIE-10 pero no detiene la ejecución
 * si falla (útil para ambientes de desarrollo o cuando la API está caída)
 */
export const softValidateCIE10Middleware = async (request, response, next) => {
    try {
        const { codigo } = request.body;

        if (!codigo) {
            return next();
        }

        const cleanCode = codigo.trim().toUpperCase();

        // Validar formato
        if (!/^[A-Z]\d{2}(\.\d{1,2})?$/.test(cleanCode)) {
            console.warn('Formato de código CIE-10 sospechoso:', codigo);
        } else {
            // Intentar validar pero continuar aunque falle
            try {
                const result = await cie10Service.searchByCode(cleanCode);
                if (result.valid) {
                    request.cie10Info = result;
                } else {
                    console.warn('Código CIE-10 no válido:', cleanCode);
                }
            } catch (err) {
                console.warn('No se pudo validar código CIE-10:', err.message);
            }
        }

        request.body.codigo = cleanCode;
        next();

    } catch (error) {
        console.error('Error en softValidateCIE10Middleware:', error);
        next(); // Continuar aunque haya error
    }
};
