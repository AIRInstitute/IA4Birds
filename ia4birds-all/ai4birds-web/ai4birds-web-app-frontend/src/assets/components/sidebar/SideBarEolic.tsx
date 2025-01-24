import {Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { RxCross1 } from "react-icons/rx";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { Chip } from "@nextui-org/chip";

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
      <Card className="w-full h-[30vh]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col gap-2">
        {/* <p className="text-md">Latitud: <Chip>{eolicdata.coordenadas[0][0]}</Chip></p>
        <p className="text-md">Longitud: <Chip>{eolicdata.coordenadas[0][1]}</Chip></p> */}
          <p className="text-md">Ámbito: <Chip>{eolicdata.ambito}</Chip></p>
          <p className="text-md">Área de exclusión: <Chip>{eolicdata.area_excl}</Chip></p>
          <p className="text-md">Criterio: <Chip>{eolicdata.criterio}</Chip> </p>
          <p className="text-md">Espacio : <Chip>{eolicdata.espacio}</Chip></p>
          <p className="text-md">Identificación: <Chip>{eolicdata.identific}</Chip></p>
          <p className="text-md">Instalaciones: <Chip>{eolicdata.t_instalac}</Chip></p>
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