FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos de configuración del proyecto al contenedor
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el código fuente del proyecto al contenedor
COPY . .

# Exponer el puerto 80
EXPOSE 80

# Configurar la variable de entorno PORT
ENV PORT=80

# Iniciar la aplicación
CMD ["npm", "start"]
