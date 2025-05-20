FROM node:18.12.1-alpine as builder
WORKDIR /home/node/app

# Build frontend
COPY ./ai4birds-web-app-frontend ./ai4birds-web-app-frontend
WORKDIR /home/node/app/ai4birds-web-app-frontend
RUN npm install
RUN npm run build

#Build backend
WORKDIR /home/node/app
COPY ./ai4birds-web-app-backend/ ./ai4birds-web-app-backend/
WORKDIR /home/node/app/ai4birds-web-app-backend
RUN npm install
RUN npm run build

FROM node:18.12.1-alpine as production
WORKDIR /home/node/app
COPY --from=builder /home/node/app/ ./

WORKDIR /home/node/app

RUN mkdir /home/node/app/ai4birds-web-app-backend/static

RUN cp -r /home/node/app/ai4birds-web-app-frontend/dist/* /home/node/app/ai4birds-web-app-backend/static

EXPOSE 80

CMD ["node", "./ai4birds-web-app-frontend/build/index.js"]