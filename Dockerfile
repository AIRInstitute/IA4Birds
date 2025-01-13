# Imagen base para Kong
FROM kong:2.8.1-alpine as kong_base

USER root

# Instalar el plugin usando luarocks
RUN luarocks install kong-spec-expose

# Imagen base para GStreamer
FROM restreamio/gstreamer:x86_64-latest-prod as gstreamer_base

# Actualizar los repositorios e instalar los complementos necesarios
RUN apt-get update && apt-get install -y \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    && rm -rf /var/lib/apt/lists/*

# Si necesitas combinar funcionalidades, puedes elegir una imagen como base final
FROM kong:2.8.1-alpine

USER root

# Copia las dependencias de GStreamer si es necesario
COPY --from=gstreamer_base /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu
COPY --from=gstreamer_base /usr/bin /usr/bin

USER kong
