FROM nginx:1.15.12-alpine
ARG ENVIRONMENT=prod

# Copy files
COPY ./nginx_dockerfile/nginx-conf ./nginx-conf
RUN cp ./nginx-conf/${ENVIRONMENT}/nginx.conf /etc/nginx/conf.d

CMD ["nginx", "-g", "daemon off;", "-p", "/tmp/"]