# Etapa 1: Construcción
FROM node:18.12.1-alpine as builder

# Establece el directorio de trabajo
WORKDIR /home/node/app

# Copia los archivos necesarios para instalar dependencias y compilar
COPY package*.json tsconfig.json /home/node/app/
COPY ./ai4birds-web-app-backend /home/node/app/ai4birds-web-app-backend

# Mueve al directorio del backend
WORKDIR /home/node/app/ai4birds-web-app-backend

# Instala las dependencias
RUN npm install

# Compila el proyecto
RUN npm run build

# Etapa 2: Producción
FROM node:18.12.1-alpine

# Establece el directorio de trabajo
WORKDIR /home/node/app

# Copia los archivos compilados desde la etapa de construcción
COPY --from=builder /home/node/app/ai4birds-web-app-backend /home/node/app

# Expone el puerto del backend
EXPOSE 3030

# Comando para iniciar el servidor
CMD ["npm", "run", "dev"]
