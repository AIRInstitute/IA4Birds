FROM node:18.12.1-alpine as builder
WORKDIR /home/node/app

#Build backend
COPY . .
WORKDIR /home/node/app/node-backend
RUN npm install
RUN npm run build

CMD ["npm", "run", "dev"]
