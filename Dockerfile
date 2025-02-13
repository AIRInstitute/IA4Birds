# # Imagen base para GStreamer
# FROM restreamio/gstreamer:x86_64-latest-prod as gstreamer_base

# # Actualizar repositorios e instalar complementos necesarios
# RUN apt-get update && apt-get install -y \
#     gstreamer1.0-plugins-good \
#     gstreamer1.0-plugins-base \
#     gstreamer1.0-plugins-bad \
#     gstreamer1.0-plugins-ugly \
#     gstreamer1.0-libav \
#     && rm -rf /var/lib/apt/lists/*

# # Imagen final basada en GStreamer
# FROM restreamio/gstreamer:x86_64-latest-prod

# # Copia dependencias desde la etapa base
# COPY --from=gstreamer_base /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu
# COPY --from=gstreamer_base /usr/bin /usr/bin

# # Define el punto de entrada directo para gst-launch
# ENTRYPOINT [ "gst-launch-1.0" ]

# # Si necesitas argumentos adicionales, usa CMD
# CMD [ "rtspsrc", "location=${RTSP_URL} ! rtph264depay ! h264parse ! queue ! rtph264pay pt=96 ! webrtcbin stun-server=stun://stun.l.google.com:19302" ]
# Imagen base para GStreamer
FROM restreamio/gstreamer:2025-01-13T18-56-16Z-prod

# Instalar dependencias faltantes
RUN apt-get update && apt-get install -y \
    libqrencode4 \
    libfluidsynth3 \
    libxv1 \
    libxtst6 \
    libjson-glib-1.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Definir punto de entrada predeterminado
# ENTRYPOINT [ "gst-launch-1.0" ]
# Definir punto de entrada predeterminado
ENTRYPOINT [ "sh", "-c" ]

# Ejecutar el pipeline RTSP con TCP para evitar bloqueos por firewall
#CMD [ "rtspsrc", "location=${RTSP_URL} ! rtph264depay ! h264parse ! queue ! rtph264pay pt=96 ! webrtcbin stun-server=stun://stun.l.google.com:19302" ]
#CMD [ "sh", "-c", "gst-launch-1.0 rtspsrc location=${RTSP_URL} ! rtph264depay ! h264parse ! queue ! rtph264pay pt=96 ! webrtcbin stun-server=stun://stun.l.google.com:19302" ]
#CMD [ "gst-launch-1.0 rtspsrc location=$RTSP_URL ! rtph264depay ! h264parse ! queue ! rtph264pay pt=96 ! webrtcbin stun-server=stun://stun.l.google.com:19302" ]
CMD [ "gst-launch-1.0 rtspsrc location=$RTSP_URL_CAM ! rtph264depay ! h264parse ! queue ! rtph264pay pt=96 ! webrtcbin stun-server=stun://stun.l.google.com:19302" ]