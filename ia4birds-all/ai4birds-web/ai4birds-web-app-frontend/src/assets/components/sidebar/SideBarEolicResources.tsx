import React, {useState,useEffect} from 'react';
import {Divider,Link, Card, CardHeader, CardBody,Chip} from "@nextui-org/react";
import { RxCross1 } from "react-icons/rx";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FrequencyWindSpeed } from '../Charts/FrequencyWindSpeed';
import {WindRose} from '../Charts/WindRose';
import { Weibull } from '../Charts/Weibull';
import { VerticalWindSpeed } from '../Charts/VerticalWindSpeed';
import ExclusionEolicService from '../services/ExclusionEolicService';

const SidebarEolicResources = ({ isOpen, onCancel,eolicResourcesdata}) => {

    const [eolicWindMapData, setEolicWindMapData] = useState([]);

    console.log('Estoy dentro de SidebarEolicResources');
    console.log('EolicData dentro del SideBarEolicResources: ', eolicResourcesdata);

    useEffect(() => {
        // Esta función se ejecutará una vez cuando el componente se monte en el DOM
        console.log('La página se ha cargado MapComponent');
        
        // Llama a tu función aquí
        getEolicResources();
      }, []);

    //FUNCIÓN QUE PONE ESTILOS AL 
    const renderIndicator = (onClickHandler, isSelected) => {
        const customStyle = {
          background: isSelected ? '#55436F' : '#ccc', 
          width: '10px', 
          height: '10px', 
          borderRadius: '50%', 
          display: 'inline-block', 
          margin: '0 5px', // Margen entre los puntos
          cursor: 'pointer', // Cambiar el cursor al pasar sobre los puntos
        };
    
        return (
          <span style={customStyle} onClick={onClickHandler} />
        );
      };

      const getEolicResources = () => { 
        const body = {
            "lat": eolicResourcesdata.lat,
            "lng": eolicResourcesdata.lng,
            "z": 50
        };
        ExclusionEolicService.getExclusionResourcesMap(body).then((response) => {
            if (response.status === 200) {
            console.log('ExclusionEolicService.getExclusionResourcessssss() response ', response.data);
            setEolicWindMapData(response.data);
            }
            else {
            throw new Error(response.data);
            }
        });
    }

  return (
    <div className={`sidebarExclusionResources ${isOpen ? 'open' : ''}`}>
      <div className="content">
      <div className="header py-3">
            <h2>Datos de los recursos eólicos</h2>
            <button onClick={onCancel}><RxCross1 style={{ height: '30px', width: '30px'}} /></button>
        </div>
        <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
        <div className="flex flex-col gap-2">
        {/* <p className="text-md">Latitud: <Chip>{eolicdata.coordenadas[0][0]}</Chip></p>
        <p className="text-md">Longitud: <Chip>{eolicdata.coordenadas[0][1]}</Chip></p> */}
          <p className="text-md">Latitud: <Chip>{eolicResourcesdata.lat}</Chip></p>
          <p className="text-md">Longitud: <Chip>{eolicResourcesdata.lng}</Chip></p>
          <p className="text-md">Altitud: <Chip>50</Chip> </p>
        </div>
        </CardHeader>
        <CardBody>
        <div className="min-h-460 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel 
                showArrows={true} 
                autoPlay={true} 
                infiniteLoop={true} 
                showThumbs={false}
                showStatus={false}
                interval={3000}
                renderIndicator={renderIndicator}
                
            >
                <div>
                    <FrequencyWindSpeed eolicWindMapData={eolicWindMapData.daily_wind_temp}/>
                    {/* <p className="legend">Perfil medio diario de la velocidad del viento</p> */}
                </div>
                <div>
                    <WindRose/>
                    {/* <p className="legend">Slide 2</p> */}
                </div>
                <div>
                    <Weibull/>
                    {/* <p className="legend">Slide 3</p> */}
                </div>
                <div>
                    <VerticalWindSpeed/>
                    {/* <p className="legend">Slide 4</p> */}
                </div>
            </Carousel>
        </div>
        </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SidebarEolicResources;