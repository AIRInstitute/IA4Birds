# Usa una imagen base de Node.js
FROM node:18.12.1-alpine as builder

# Establece el directorio de trabajo
WORKDIR /home/node/app

# Copia los archivos necesarios al contenedor
COPY package.json package-lock.json tsconfig.json /home/node/app/
COPY bin /home/node/app/bin
COPY config /home/node/app/config
COPY controllers /home/node/app/controllers
COPY middleware /home/node/app/middleware
COPY models /home/node/app/models
COPY routes /home/node/app/routes
COPY scripts /home/node/app/scripts
COPY utils /home/node/app/utils
COPY documentation /home/node/app/documentation
COPY app.ts /home/node/app/app.ts

# Instala las dependencias
RUN npm install

# Compila el proyecto
RUN npm run build

# Usa una imagen ligera para producción
FROM node:18.12.1-alpine

# Establece el directorio de trabajo
WORKDIR /home/node/app

# Copia los archivos compilados desde el contenedor builder
COPY --from=builder /home/node/app /home/node/app

# Expone el puerto de la aplicación
EXPOSE 3030

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]
