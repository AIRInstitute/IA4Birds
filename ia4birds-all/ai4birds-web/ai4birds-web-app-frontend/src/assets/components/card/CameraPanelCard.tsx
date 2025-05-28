import { useEffect, useRef } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Hls from "hls.js";
import { RxTrash } from "react-icons/rx";

export const CustomCard = ({ cameraPanelData, onDelete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = cameraPanelData.playback_url;

  const gpsData =
    cameraPanelData.latitude && cameraPanelData.longitude
      ? `Latitud: ${cameraPanelData.latitude}, Longitud: ${cameraPanelData.longitude}`
      : "No disponible";

  const storageInfo = cameraPanelData.storage_info || "No disponible";
  const status = cameraPanelData.status || "No disponible";
  const name = cameraPanelData.name?.trim() || "Cámara sin nombre";
  const location = cameraPanelData.location || "Ubicación desconocida";

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Video HLS cargado y listo");
      });
      return () => {
        hls.destroy();
      };
    } else if (videoRef.current) {
      videoRef.current.src = videoUrl;
    }
  }, [videoUrl]);

  const handleDeleteClick = () => {
    if (onDelete && cameraPanelData.id) {
      onDelete(cameraPanelData.id, cameraPanelData.name);
    }
  };

  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex items-center justify-between">
        <div>
          <p className="text-tiny uppercase font-bold">{location}</p>
          <h4 className="font-bold text-large">{name}</h4>
        </div>
        {onDelete && (
          <Button isIconOnly color="secondary" onClick={handleDeleteClick}>
            <RxTrash size={20} color="black" />
          </Button>
        )}
      </CardHeader>
      <CardBody className="overflow-visible py-2 flex">
        <div className="flex gap-4">
          <div className="flex-3/4 w-3/4 p-2">
            <video
              ref={videoRef}
              className="h-[69vh] w-full rounded-xl"
              controls
              autoPlay
            >
              <source src={videoUrl} type="application/x-mpegURL" />
              Su navegador no soporta el elemento video.
            </video>
          </div>

          <div className="flex-1/4 w-1/4 p-2 h-[69vh]">
            <h2 className="text-lg font-bold">Datos del vídeo</h2>
            <div>
              <p><strong>Datos GPS:</strong> {gpsData}</p>
              <p><strong>Estado cámara:</strong> {status}</p>
              <p><strong>Datos de almacenamiento:</strong> {storageInfo}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
