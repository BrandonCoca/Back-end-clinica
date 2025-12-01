import cie10Service from '../../Services/cie10Service.js';

/**
 * Controlador para buscar códigos CIE-10 por descripción/nombre de enfermedad
 * GET /api/v1/cie10/search?term=diabetes&max=10
 * 
 * Busca códigos CIE-10 por el nombre de la enfermedad en español
 * Los doctores pueden escribir el nombre de la enfermedad sin conocer el código
 */
export const searchCIE10ByTerm = async (request, response) => {
    try {
        const { term, max, lang } = request.query;

        if (!term) {
            return response.status(400).json({
                success: false,
                message: 'El término de búsqueda es requerido'
            });
        }

        const maxResults = parseInt(max) || 10;
        const language = lang || 'es'; // Por defecto español
        const result = await cie10Service.searchByTerm(term, maxResults, language);

        if (result.success) {
            return response.status(200).json({
                success: true,
                data: result.results,
                total: result.results.length,
                language
            });
        } else {
            return response.status(404).json({
                success: false,
                message: result.error || 'No se encontraron resultados'
            });
        }

    } catch (error) {
        console.error('Error en searchCIE10ByTerm:', error);
        return response.status(500).json({
            success: false,
            message: 'Error al buscar términos CIE-10',
            error: error.message
        });
    }
};
