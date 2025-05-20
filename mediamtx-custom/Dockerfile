FROM alpine:latest

WORKDIR /app
COPY mediamtx /app/mediamtx
COPY mediamtx.yml /app/mediamtx.yml

EXPOSE 8554 8888 8889 8890/udp 8189

CMD ["./mediamtx", "mediamtx.yml"]
