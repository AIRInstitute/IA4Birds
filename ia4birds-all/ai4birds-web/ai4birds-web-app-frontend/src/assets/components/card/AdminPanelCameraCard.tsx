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
          {cameraAdminData.map(camera => (
            <Card key={camera.id} className="w-full py-3">
              <h2 className="p-1 text-center">{camera.name}</h2>
              <CardBody>
                <div className="my-2 flex justify-center">
                  <Image
                    alt={`Imagen de ${camera.name}`}
                    className="max-h-[14vh] object-cover content-center"
                    src={camera.url}
                  />
                </div>
                <div>
                  <p>Datos GPS</p>
                  <p>Datos estado cam</p>
                  <p>Datos almacenamiento</p>
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
