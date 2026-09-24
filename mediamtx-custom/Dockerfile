FROM debian:bookworm-slim

WORKDIR /app

# Instala los certificados de autoridades reconocidas
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates tzdata \
  && rm -rf /var/lib/apt/lists/*

COPY mediamtx /app/mediamtx
COPY mediamtx.yml /app/mediamtx.yml

RUN chmod +x /app/mediamtx

EXPOSE 8554 8888 8889 8890/udp 8189

CMD ["/app/mediamtx", "mediamtx.yml"]
