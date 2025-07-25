import * as React from 'react';
import {Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/card";
import { Progress } from "@nextui-org/progress";
import { RxCross1 } from "react-icons/rx";

const Sidebar = ({ isOpen, onCancel, birdData }) => {
    const [selected, setSelected] = React.useState("login");

    console.log('Estoy dentro de Sidebar y este es el birdData: ', birdData);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''} z-50`}>
      <div className="content">
      <div className="header">
        <h2 className='mb-5'> Datos de la especie </h2>
        <button onClick={onCancel}><RxCross1 style={{ height: '30px', width: '30px'}} /></button>
        </div>
        <p>Nombre común: {birdData.comName}</p>
        <p className='py-2'>Nombre científico: {birdData.sciName}</p>
        <div className="flex flex-col w-full">
      <Card className="w-full h-[67vh] mt-2">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key.toString())}
          >
            <Tab title="Aves">
              <p className='py-2'>Latitud: {birdData.observations[0].lat}</p>
              <p className='py-2'>Longitud: {birdData.observations[0].lng}</p>
              <p className='py-2'>Localización: {birdData.observations[0].locationName}</p>
              <p className='py-2'>Fecha de observación: {birdData.observations[0].obsDt}</p>
              <Progress className="py-2" 
                        color="primary"  
                        label="Número de aves" 
                        maxValue={100} 
                        aria-label="Cargando..." 
                        showValueLabel={true} 
                        formatOptions={{style: "decimal"}}
                        value={birdData.observations[0].numObservation}/>
              
                {/* <React.Fragment key={birdData.observations[0].lat}>
                <div>
                <User
                className='py-3'   
                name={birdData.observations[0].lat}
                description={birdData.observations[0]}
                // avatarProps={{
                //     src: bird.url
                // }}
                />
                </div>
                <Progress color="primary" aria-label="Loading..." value={9}/>
                </React.Fragment> */}
            </Tab>

            {/* <Tab  title="Sensibilidad eólica">

              <p>Datos de la sensibilidad eólica</p>
            </Tab> */}
          </Tabs>
        </CardBody>
      </Card>
    </div>
      </div>
    </div>
  );
};

export default Sidebar;