FROM debian:bullseye-slim

WORKDIR /app
COPY mediamtx /app/mediamtx
COPY mediamtx.yml /app/mediamtx.yml

RUN chmod +x /app/mediamtx

EXPOSE 8554 8888 8889 8890/udp 8189

CMD ["/app/mediamtx", "mediamtx.yml"]
