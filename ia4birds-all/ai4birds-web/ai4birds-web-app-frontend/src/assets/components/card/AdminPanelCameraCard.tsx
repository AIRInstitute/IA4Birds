import * as React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
// import { Text } from "@nextui-org/react";

export const CustomCardCamera = ({ cameraAdminData }) => {
//   if (!data) {
//     return <Text>Loading data...</Text>;
//   }

  return (
    <Card className="py-4 h-[83vh] overflow-hidden">
      <CardHeader className="pb-0 pt-2 px-4">
        <h1 className="font-bold text-xl">Panel de Cámaras</h1>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="my-3 flex justify-center">
          <Card className="w-full py-3 mx-4">
            <h2 className="p-1 text-center">Cámara 1</h2>
            <CardBody>
              <div className="my-2 flex justify-center">
                <Image
                  alt="Card background"
                  className="max-h-[12vh] object-cover content-center"
                  src={cameraAdminData[0].url}
                />
              </div>
              <div>
                <p>Datos GPS</p>
                <p>Datos estado cam</p>
                <p>Datos almacenamiento</p>
              </div>
              <Link href="/camera-panel-component" 
                style={location.pathname== "/camera-panel-component" ? { textDecoration: 'underline', color:'#55436F'} : {textDecoration: 'none'} } className="place-content-end cursor-pointer" >
                  Ver más...
              </Link>
            </CardBody>
          </Card>
          <Card className="w-full py-3">
            <h2 className="p-1 text-center">Cámara 2</h2>
            <CardBody>
            <div className="my-2 flex justify-center">
                <Image
                  alt="Card background"
                  className="max-h-[12vh] object-cover content-center"
                  src={cameraAdminData[0].url}
                />
              </div>
              <div>
                <p>Datos GPS</p>
                <p>Datos estado cam</p>
                <p>Datos almacenamiento</p>
              </div>
              <Link href="/camera-panel-component" 
                style={location.pathname== "/camera-panel-component" ? { textDecoration: 'underline', color:'#55436F'} : {textDecoration: 'none'} } className="place-content-end cursor-pointer" >
                  Ver más...
              </Link>
            </CardBody>
          </Card>
        </div>
        <div className="my-3 flex justify-center">
          <Card className="py-3 w-1/2">
            <h2 className="p-1 text-center">Cámara 3</h2>
            <CardBody>
            <div className="my-2 flex justify-center">
                <Image
                  alt="Card background"
                  className="max-h-[12vh] object-cover content-center"
                  src={cameraAdminData[0].url}
                />
              </div>
              <div>
                <p>Datos GPS</p>
                <p>Datos estado cam</p>
                <p>Datos almacenamiento</p>
              </div>
              <Link href="/camera-panel-component" 
                style={location.pathname== "/camera-panel-component" ? { textDecoration: 'underline', color:'#55436F'} : {textDecoration: 'none'} } className="place-content-end cursor-pointer" >
                  Ver más...
              </Link>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};