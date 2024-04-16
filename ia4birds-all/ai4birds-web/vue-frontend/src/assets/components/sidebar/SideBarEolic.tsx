import React from 'react';
import {Divider,Link, Card, CardBody, CardHeader, CardFooter, Chip} from "@nextui-org/react";
import { RxCross1 } from "react-icons/rx";

const SidebarEolic = ({ isOpen, onCancel,eolicdata}) => {

    console.log('Estoy dentro de SidebarEolic');
    console.log('EolicData dentro del SideBarEolic: ', eolicdata);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="content">
      <div className="header py-3">
            <h2>Datos de la exclusión eólica</h2>
            <button onClick={onCancel}><RxCross1 style={{ height: '30px', width: '30px'}} /></button>
        </div>
      <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col gap-2">
        <p className="text-md">Latitud: <Chip>{eolicdata.Latitud}</Chip></p>
        <p className="text-md">Longitud: <Chip>{eolicdata.Longitud}</Chip></p>
          <p className="text-md">Ámbito: <Chip>{eolicdata.ambito}</Chip></p>
          <p className="text-md">Área de exclusión: <Chip>{eolicdata.area_excl}</Chip></p>
          <p className="text-md">Criterio: <Chip>{eolicdata.criterio}</Chip> </p>
          <p className="text-md">Espacio : <Chip>{eolicdata.espacio}</Chip></p>
          <p className="text-md">Identificación: <Chip>{eolicdata.identific}</Chip></p>
          <p className="text-md">Instalaciones": <Chip>{eolicdata.t_instalac}</Chip></p>
        </div>
      </CardHeader>
      {/* <Divider/>
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
      <Divider/>
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://github.com/nextui-org/nextui"
        >
          Visit source code on GitHub.
        </Link>
      </CardFooter> */}
    </Card>
      </div>
    </div>
  );
};

export default SidebarEolic;