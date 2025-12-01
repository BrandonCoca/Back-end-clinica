import axios from 'axios';

/**
 * Servicio para interactuar con la API del CIE-10
 * Utiliza la API pública de icd10api.com
 */
class CIE10Service {
    constructor() {
        // API gratuita con límite de 2500 requests por día
        this.baseURL = 'http://www.icd10api.com/';
        this.timeout = 5000; // 5 segundos de timeout
    }

    /**
     * Busca información de un código CIE-10 específico
     * @param {string} code - Código CIE-10 (ej: "A00.1", "E11.9")
     * @param {string} lang - Idioma ('es' para español, 'en' para inglés)
     * @returns {Promise<Object>} - Información del código CIE-10
     */
    async searchByCode(code, lang = 'es') {
        try {
            // Limpiar el código (remover espacios y convertir a mayúsculas)
            const cleanCode = code.trim().toUpperCase();

            // Validar formato básico del código CIE-10 (letra seguida de números)
            if (!/^[A-Z]\d{2}(\.\d{1,2})?$/.test(cleanCode)) {
                return {
                    valid: false,
                    error: 'Formato de código CIE-10 inválido. Debe ser como: A00, A00.1, E11.9'
                };
            }

            const response = await axios.get(this.baseURL, {
                params: {
                    code: cleanCode,
                    r: 'json', // Formato de respuesta
                    desc: 'long' // Descripción larga
                },
                timeout: this.timeout
            });

            if (response.data && response.data.Description) {
                return {
                    valid: true,
                    code: cleanCode,
                    description: response.data.Description,
                    billable: response.data.Billable || false,
                    category: response.data.Category || null,
                    fullData: response.data
                };
            } else {
                return {
                    valid: false,
                    error: 'Código CIE-10 no encontrado'
                };
            }

        } catch (error) {
            console.error('Error al consultar API CIE-10:', error.message);

            // Si hay error de red o timeout, devolver información básica
            return {
                valid: false,
                error: 'Error al consultar la API del CIE-10',
                details: error.message
            };
        }
    }

    /**
     * Busca códigos CIE-10 por término de búsqueda (solo en español)
     * @param {string} searchTerm - Término de búsqueda
     * @param {number} maxResults - Máximo de resultados a retornar
     * @returns {Promise<Object>} - Lista de códigos CIE-10 que coinciden
     */
    async searchByTerm(searchTerm, maxResults = 10) {
        try {
            // Intenta primero con la API de la OMS (soporta español)
            const whoResults = await this.searchByTermWHO(searchTerm, maxResults);
            if (whoResults.success && whoResults.results.length > 0) {
                return whoResults;
            }

            // Si la API de la OMS falla, usar ClinicalTables y traducir
            const response = await axios.get('https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search', {
                params: {
                    sf: 'code,name',  // Campos a buscar (code y name)
                    terms: searchTerm,
                    maxList: maxResults
                },
                timeout: this.timeout
            });

            // Formato de respuesta: [total, [códigos], null, [[código, descripción], ...]]
            if (response.data && Array.isArray(response.data) && response.data.length >= 4) {
                const codes = response.data[3] || [];

                const results = codes.map(item => ({
                    code: item[0],
                    description: item[1],
                    language: 'en'
                }));

                // Enriquecer con traducciones al español desde base local
                return {
                    success: true,
                    results: await this.enrichWithSpanish(results)
                };
            }

            return {
                success: false,
                results: [],
                error: 'No se encontraron resultados'
            };

        } catch (error) {
            console.error('Error al buscar en API CIE-10:', error.message);
            return {
                success: false,
                results: [],
                error: 'Error al realizar la búsqueda',
                details: error.message
            };
        }
    }

    /**
     * Busca en la API de la OMS (WHO ICD API) - Soporta español
     * Nota: Requiere token de la OMS (gratuito con registro)
     */
    async searchByTermWHO(searchTerm, maxResults = 10) {
        try {
            // API de la OMS para CIE-10 en español
            // Endpoint: https://id.who.int/icd/release/10/2019/search
            const response = await axios.get('https://id.who.int/icd/release/10/2019/search', {
                params: {
                    q: searchTerm,
                    useFlexisearch: 'true',
                    flatResults: 'true'
                },
                headers: {
                    'Accept-Language': 'es',
                    'API-Version': 'v2',
                    'Accept': 'application/json'
                },
                timeout: this.timeout
            });

            if (response.data && response.data.destinationEntities) {
                const results = response.data.destinationEntities
                    .slice(0, maxResults)
                    .map(item => ({
                        code: item.theCode || item.code,
                        description: item.title || item.name,
                        language: 'es'
                    }));

                return {
                    success: true,
                    results
                };
            }

            return {
                success: false,
                results: []
            };

        } catch (error) {
            console.warn('API de la OMS no disponible:', error.message);
            return {
                success: false,
                results: []
            };
        }
    }

    /**
     * Enriquece los resultados en inglés con descripciones en español desde base local
     * Retorna todos los resultados: en español si hay traducción, en inglés si no
     */
    async enrichWithSpanish(results) {
        // Base de datos local de códigos comunes en español
        const spanishDB = this.getSpanishDatabase();

        return results.map(result => {
            const spanishEntry = spanishDB[result.code];
            if (spanishEntry) {
                // Hay traducción al español
                return {
                    code: result.code,
                    description: spanishEntry,
                    language: 'es'
                };
            }
            // No hay traducción, mantener en inglés
            return {
                code: result.code,
                description: result.description,
                language: 'en'
            };
        });
    }

    /**
     * Base de datos local con los códigos CIE-10 más comunes en español
     */
    getSpanishDatabase() {
        return {
            // Enfermedades endocrinas y metabólicas (E00-E90)
            'E10.9': 'Diabetes mellitus tipo 1 sin complicaciones',
            'E10.65': 'Diabetes mellitus tipo 1 con hiperglucemia',
            'E10.A0': 'Diabetes mellitus tipo 1 presintomática no especificada',
            'E10.10': 'Diabetes mellitus tipo 1 con cetoacidosis sin coma',
            'E10.21': 'Diabetes mellitus tipo 1 con nefropatía',
            'E10.22': 'Diabetes mellitus tipo 1 con enfermedad renal crónica',
            'E10.29': 'Diabetes mellitus tipo 1 con otra complicación renal',
            'E10.36': 'Diabetes mellitus tipo 1 con neuropatía periférica',
            'E10.40': 'Diabetes mellitus tipo 1 con neuropatía diabética no especificada',
            'E10.51': 'Diabetes mellitus tipo 1 con complicación circulatoria periférica',

            'E11.9': 'Diabetes mellitus tipo 2 sin complicaciones',
            'E11.65': 'Diabetes mellitus tipo 2 con hiperglucemia',
            'E11.22': 'Diabetes mellitus tipo 2 con enfermedad renal crónica',
            'E11.69': 'Diabetes mellitus tipo 2 con otra complicación especificada',
            'E11.00': 'Diabetes mellitus tipo 2 con hiperosmolaridad sin coma',
            'E11.21': 'Diabetes mellitus tipo 2 con nefropatía',
            'E11.29': 'Diabetes mellitus tipo 2 con otra complicación renal',
            'E11.36': 'Diabetes mellitus tipo 2 con neuropatía periférica',
            'E11.40': 'Diabetes mellitus tipo 2 con neuropatía diabética no especificada',
            'E11.51': 'Diabetes mellitus tipo 2 con complicación circulatoria periférica',
            'E11.59': 'Diabetes mellitus tipo 2 con otra complicación circulatoria',

            'E13.9': 'Otros tipos especificados de diabetes mellitus sin complicaciones',
            'E13.65': 'Otros tipos especificados de diabetes mellitus con hiperglucemia',

            'E23.2': 'Diabetes insípida',
            'P70.2': 'Diabetes mellitus neonatal',

            'E78.5': 'Hiperlipidemia no especificada',
            'E78.0': 'Hipercolesterolemia pura',
            'E78.1': 'Hipergliceridemia pura',
            'E78.2': 'Hiperlipidemia mixta',

            'E66.9': 'Obesidad no especificada',
            'E66.01': 'Obesidad mórbida debida a calorías excesivas',
            'E66.8': 'Otra obesidad',

            'E03.9': 'Hipotiroidismo no especificado',
            'E05.90': 'Tirotoxicosis no especificada sin crisis tirotóxica',
            'E04.9': 'Bocio no tóxico no especificado',
            'E06.3': 'Tiroiditis autoinmune',

            // Enfermedades del sistema circulatorio (I00-I99)
            'I10': 'Hipertensión esencial (primaria)',
            'I11.9': 'Enfermedad cardíaca hipertensiva sin insuficiencia cardíaca',
            'I25.10': 'Enfermedad aterosclerótica del corazón sin angina de pecho',
            'I48.91': 'Fibrilación auricular no especificada',
            'I50.9': 'Insuficiencia cardíaca no especificada',
            'I21.9': 'Infarto agudo de miocardio no especificado',
            'I63.9': 'Infarto cerebral no especificado',

            // Enfermedades del sistema respiratorio (J00-J99)
            'J45.9': 'Asma no especificado',
            'J45.20': 'Asma leve intermitente sin complicaciones',
            'J45.40': 'Asma persistente moderado sin complicaciones',
            'J44.9': 'Enfermedad pulmonar obstructiva crónica no especificada',
            'J06.9': 'Infección aguda de las vías respiratorias superiores no especificada',
            'J18.9': 'Neumonía no especificada',
            'J20.9': 'Bronquitis aguda no especificada',
            'J40': 'Bronquitis no especificada como aguda o crónica',

            // Enfermedades del sistema digestivo (K00-K93)
            'K21.9': 'Enfermedad por reflujo gastroesofágico sin esofagitis',
            'K29.70': 'Gastritis no especificada sin sangrado',
            'K29.0': 'Gastritis hemorrágica aguda',
            'K58.9': 'Síndrome del intestino irritable sin diarrea',
            'K80.20': 'Colelitiasis de vesícula biliar sin obstrucción',

            // Enfermedades del sistema genitourinario (N00-N99)
            'N39.0': 'Infección de vías urinarias, sitio no especificado',
            'N18.9': 'Enfermedad renal crónica no especificada',
            'N25.1': 'Diabetes insípida nefrogénica',

            // Síntomas y signos (R00-R99)
            'R50.9': 'Fiebre no especificada',
            'R51': 'Cefalea',
            'R10.9': 'Dolor abdominal no especificado',
            'R05': 'Tos',
            'R06.02': 'Dificultad para respirar',
            'R53.83': 'Fatiga',

            // Enfermedades infecciosas (A00-B99)
            'A09': 'Diarrea y gastroenteritis de presunto origen infeccioso',
            'B34.9': 'Infección viral no especificada',

            // Embarazo, parto y puerperio (O00-O99)
            'O24.92': 'Diabetes mellitus no especificada en el parto',
            'O24.91': 'Diabetes mellitus no especificada en el embarazo',
            'O24.019': 'Diabetes mellitus preexistente tipo 1 en el embarazo',
            'O24.119': 'Diabetes mellitus preexistente tipo 2 en el embarazo',
            'O24.419': 'Diabetes mellitus gestacional en el embarazo',

            // Enfermedades del sistema musculoesquelético (M00-M99)
            'M79.3': 'Paniculitis no especificada',
            'M25.50': 'Dolor en articulación no especificada',
            'M54.5': 'Dolor de espalda baja',

            // Factores que influyen en el estado de salud (Z00-Z99)
            'Z83.3': 'Antecedentes familiares de diabetes mellitus',
            'Z86.32': 'Antecedentes personales de diabetes mellitus gestacional',
            'Z00.00': 'Examen médico general sin quejas',
            'Z01.00': 'Examen de ojos y visión sin hallazgos anormales',
            'Z13.1': 'Examen de detección especial para diabetes mellitus',
            'Z79.4': 'Uso a largo plazo (actual) de insulina',
            'Z79.84': 'Uso a largo plazo (actual) de hipoglucemiantes orales'
        };
    }

    /**
     * Valida si un código CIE-10 es válido
     * @param {string} code - Código CIE-10 a validar
     * @returns {Promise<boolean>} - true si el código es válido
     */
    async validateCode(code) {
        const result = await this.searchByCode(code);
        return result.valid === true;
    }
}

// Exportar una instancia única del servicio (Singleton)
export default new CIE10Service();
