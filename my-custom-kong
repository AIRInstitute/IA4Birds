FROM kong:2.8.1-alpine
USER root

# Instala el plugin usando luarocks
RUN luarocks install kong-spec-expose

USER kong
