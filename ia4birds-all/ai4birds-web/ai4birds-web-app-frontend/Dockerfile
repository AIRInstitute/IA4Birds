FROM node:18.12.1-alpine as builder
WORKDIR /home/node/app

# Build frontend
COPY . .
WORKDIR /home/node/app/vue-frontend
RUN npm install

CMD ["npm", "run", "dev"]