const fs = require('fs');
const path = require('path');
const openaiService = require('../utils/openai');
const Request = require('../models/Request');
const stringSimilarity = require('string-similarity'); // Importamos la librería

class ChatService {
    constructor() {
        const dictionaryPath = path.join(__dirname, '../data/faqData.json');
        try {
            let fileContent = fs.readFileSync(dictionaryPath, 'utf-8');

            // Eliminar el BOM si existe
            if (fileContent.charCodeAt(0) === 0xFEFF) {
                fileContent = fileContent.slice(1);
            }

            this.dictionary = JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error al cargar el archivo FAQ: ${error.message}`);
            this.dictionary = []; // Configura un valor por defecto en caso de error
        }
    }

    // Método de clase para normalizar cadenas
    removeDiacritics(str) {
        return str
            .normalize('NFD') // Descompone caracteres con acentos en base + diacrítico
            .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos (acentos)
            .replace(/[!¡¿?.,:;]/g, '') // Elimina los símbolos de puntuación
            .toLowerCase(); // Convierte todo a minúsculas
    }

    findSimilarQuestion(userInput) {
        // Normalizamos la entrada del usuario
        const normalizedInput = this.removeDiacritics(userInput);

        // Normalizamos las preguntas del diccionario
        const questions = this.dictionary.map(item => this.removeDiacritics(item.question));

        // Utilizamos string-similarity para encontrar la mejor coincidencia
        const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(normalizedInput, questions);

        console.log(`Pregunta del usuario: ${userInput} - Mejor coincidencia: ${bestMatch.target} - Puntaje: ${bestMatch.rating}`);

        // Por ejemplo, establecemos un umbral de similitud
        const threshold = 0.5;

        if (bestMatch.rating >= threshold) {
            return this.dictionary[bestMatchIndex];
        } else {
            return null;
        }
    }

    async generateResponse(userInput, context = []) {
        let history = '';
        if (context.length > 0) {
            history = context.map(msg => `${msg.role === 'user' ? 'Usuario' : 'Bot'}: ${msg.content}`).join('\n');
        }
        const matchedQuestion = this.findSimilarQuestion(userInput);

        if (matchedQuestion) {
            // Si hay una pregunta similar en el diccionario, devuelve la respuesta
            return {
                format: 'markdown',
                content: matchedQuestion.answer,
            };
        } else {
            // Si no hay una pregunta similar, generar contexto y usar OpenAI
            const requests = await Request.find({ status: 'activa' }).lean(); // Datos de los productos activos
            const context = `
                Contexto de la plataforma:
                - La plataforma se llama MetAgro. 
                - MetAgro es una plataforma digital diseñada para transformar la interacción entre los productores agrícolas y agropecuarios y las empresas turísticas del departamento del Meta. 
                - Su nombre fusiona "Meta" y "Agro", reflejando su enfoque en fortalecer la economía agrícola y agropecuaria de la región mientras promueve su integración con el sector turístico.
                - La plataforma está diseñada para facilitar la interacción entre agricultores, empresas turísticas y proveedores de insumos agrícolas.
                - Los usuarios pueden registrarse en uno de estos roles: agricultor, proveedor de insumos o empresa turística.
                - Los agricultores y proveedores pueden publicar productos o servicios disponibles para la venta, y las empresas turísticas pueden solicitar productos específicos.
                - El asistente virtual ayuda a los usuarios a encontrar productos, responder preguntas frecuentes y guiar en el uso de la plataforma.
                - La unidades son arrobas para los productos agrícolas y agropecuarios.
                
                También puedes responder preguntas sobre la gastronomía típica exclusivamente del Meta y la región de la Orinoquia (EJ: Mamona, Hayacas, Arepas de arroz, Chigüiro asado, Caldo de gallina criolla, Pisillo de pescado, Tungos, Cachapas, Masato de arroz, Sancocho llanero) no de las demás regiones (detallando los ingredientes, preparación, origen, y cualquier dato relevante). En cuanto a restaurantes, proporciona únicamente aquellos que aún están en funcionamiento, verificando la ubicación y la ciudad donde se encuentran, priorizando los datos actualizados.

                Datos actuales de los productos disponibles:
                ${requests.map(req => `
                - Producto: ${req.product.name}, Cantidad: ${req.product.quantity}, Precio: ${req.product.price}, Tipo de solicitud: ${req.requestType}
                `).join('\n')}

                ${history && `Historial de la conversación hasta ahora:\n${history}`}
        
                Reglas importantes de la plataforma:
                - Los precios son transparentes y negociables entre compradores y vendedores.
                - Los usuarios pueden establecer un radio geográfico para sus ofertas o búsquedas.
        
                Ahora, responde a la pregunta del usuario considerando esta información y devuelve la respuesta en formato Markdown directo en un string no ponerle los decoradores \`\`\`markdown \`\`\` ni string = "[contenido de la respuesta]", la idea es que sea: [contenido de la respuesta].
                Usuario pregunta: "${userInput}"
            `;

            const response = await openaiService.askQuestion(context);

            // Intenta analizar la respuesta en JSON, pero devuelve texto bruto si falla
            try {
                return {
                    format: 'markdown',
                    content: JSON.parse(response),
                };
            } catch (error) {
                console.error('Error al parsear la respuesta de OpenAI como JSON:', error.message);
                return {
                    format: 'markdown',
                    content: response, // Devolver el texto original como markdown si el análisis falla
                };
            }
        }
    }
}

module.exports = new ChatService();
