module.exports = {
    async askQuestion(prompt) {
        try {
            // Importación dinámica del módulo `openai`
            const { default: OpenAI } = await import('openai');

            // Configuración del cliente de OpenAI
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY, // Asegúrate de definir esta variable en tu .env
            });

            // Crear la solicitud de completación
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt },
                ],
            });

            // Devolver la respuesta generada
            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Error al interactuar con OpenAI:', error.message);
            throw new Error('Hubo un problema al procesar tu solicitud con el asistente virtual.');
        }
    },
};
