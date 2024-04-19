FROM node:18.12.1-alpine as builder
WORKDIR /home/node/app

#Build backend
COPY . .
WORKDIR /home/node/app/ai4birds-web-app-backend
RUN npm install
RUN npm run build
RUN npm install adm-zip 
RUN npm install jsonstream

RUN npm install --save-dev @types/node @types/express
RUN npm install --save-dev @types/adm-zip

CMD ["npm", "run", "dev"]
