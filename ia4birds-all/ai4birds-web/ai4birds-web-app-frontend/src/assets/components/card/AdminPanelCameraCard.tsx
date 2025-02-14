import * as React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "react-router-dom"; // Usa React Router para manejar enlaces dinámicos.

export const CustomCardCamera = ({ cameraAdminData }) => {
  return (
    <Card className="py-4 h-[83vh] overflow-hidden">
      <CardHeader className="pb-0 pt-2 px-4">
        <h1 className="font-bold text-xl">Panel de Cámaras</h1>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="my-3 flex grid grid-cols-2 justify-center w-full gap-4">
          {cameraAdminData.map((camera, index) => (
            <Card key={camera.id} className="w-full py-3">
              <h2 className="p-1 text-center">
                {camera.name} 
                {index === 0 ? (
                  <span className="text-green-500"> (Activa)</span>
                ) : (
                  <span className="text-red-500"> (Inactiva)</span>
                )}
              </h2>
              <CardBody>
                <div className="my-2 flex justify-center">
                  {/* Envolvemos la imagen en un Link para que sea clickeable */}
                  <Link to={`/camera-panel-component?camera=${camera.id}`}>
                    <Image
                      alt={`Imagen de ${camera.name}`}
                      className="max-h-[14vh] object-cover content-center cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                      src={camera.url}
                    />
                  </Link>
                </div>
                <div>
                  <p><strong>Datos GPS:</strong> {camera.gpsData || "No disponible"}</p>
                  <p><strong>Estado cámara:</strong> {camera.status || "No disponible"}</p>
                  <p><strong>Datos de almacenamiento:</strong> {camera.storageData || "No disponible"}</p>
                </div>
                <div className="w-full flex justify-end">
                  <Link
                    to={`/camera-panel-component?camera=${camera.id}`}
                    className="place-content-end cursor-pointer"
                  >
                    Ver más...
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
