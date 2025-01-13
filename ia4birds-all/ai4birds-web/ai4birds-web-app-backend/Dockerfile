# Etapa 1: Construcción
FROM node:18.12.1-alpine as builder

# Establece el directorio de trabajo
WORKDIR /home/node/app

# Copia el archivo de dependencias
COPY package*.json tsconfig.json ./ai4birds-web-app-backend/

# Mueve al directorio del backend
WORKDIR /home/node/app/ai4birds-web-app-backend

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del backend
COPY . /home/node/app

# Compila el proyecto
RUN npm run build

# Etapa 2: Producción
FROM node:18.12.1-alpine

# Establece el directorio de trabajo
WORKDIR /home/node/app

# Copia los archivos necesarios desde la etapa de construcción
COPY --from=builder /home/node/app/ai4birds-web-app-backend /home/node/app

# Expone el puerto del backend
EXPOSE 3030

# Comando para iniciar el servidor en desarrollo
CMD ["npm", "run", "dev"]
