# Imagen base para Node.js
FROM node:18.12.1-alpine as builder

# Establece el directorio de trabajo
WORKDIR /home/node/app

# Copia solo los archivos necesarios para instalar las dependencias
COPY package.json package-lock.json ./ai4birds-web-app-backend/

# Cambia al directorio del backend
WORKDIR /home/node/app/ai4birds-web-app-backend

# Instala todas las dependencias (incluidas las devDependencies)
RUN npm install --omit=optional

# Construye el proyecto
RUN npm run build

# Imagen de producción para el backend
FROM node:18.12.1-alpine

# Establece el directorio de trabajo
WORKDIR /home/node/app

# Copia la aplicación desde el contenedor builder
COPY --from=builder /home/node/app/ai4birds-web-app-backend /home/node/app

# Expone el puerto del backend
EXPOSE 3030

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]
