import { useEffect, useRef } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import Hls from "hls.js"; // Importamos hls.js

export const CustomCard = ({ cameraPanelData }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoUrl = cameraPanelData.url;

    useEffect(() => {
        // Verificamos si el navegador soporta hls.js
        if (Hls.isSupported() && videoRef.current) {
            const hls = new Hls(); // Creamos una nueva instancia de hls.js
            hls.loadSource(videoUrl); // Cargamos la fuente del video
            hls.attachMedia(videoRef.current); // Vinculamos el video con hls.js
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("Video HLS cargado y listo");
            });
            return () => {
                hls.destroy(); // Limpiamos la instancia de hls.js cuando el componente se desmonte
            };
        } else if (videoRef.current) {
            // Si el navegador soporta HLS de manera nativa (Safari, por ejemplo)
            videoRef.current.src = videoUrl;
        }
    }, [videoUrl]);

    return (
        <>
            <Card className="py-4">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">{cameraPanelData.location}</p>
                    <small className="text-default-500">{cameraPanelData.views}</small>
                    <h4 className="font-bold text-large">{cameraPanelData.name}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2 flex">
                    <div className="flex gap-4">
                        <div className="flex-3/4 w-3/4 p-2">
                            <video
                                ref={videoRef} // Asignamos la referencia al video
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
                                <p><strong>Datos GPS:</strong> {cameraPanelData.gpsData || "No disponible"}</p>
                                <p><strong>Estado cámara:</strong> {cameraPanelData.status || "No disponible"}</p>
                                <p><strong>Datos de almacenamiento:</strong> {cameraPanelData.storageData || "No disponible"}</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
};
