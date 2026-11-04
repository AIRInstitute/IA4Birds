FROM node:22.23.4-alpine AS builder
WORKDIR /home/node/app

# Build frontend
COPY . .
RUN npm install

CMD ["npm", "run", "dev"]