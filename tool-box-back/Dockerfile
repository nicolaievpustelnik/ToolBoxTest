# Usa una imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración y las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente al contenedor
COPY . .

# Expón el puerto en el que el servidor Express escuchará
EXPOSE 4001

# Comando para iniciar la aplicación
CMD ["npm", "start"]