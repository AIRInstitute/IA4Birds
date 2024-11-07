import { useState,useEffect } from 'react';
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { RxCross1 } from "react-icons/rx";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FrequencyWindSpeed } from '../Charts/FrequencyWindSpeed';
import {WindRose} from '../Charts/WindRose';
import { Weibull } from '../Charts/Weibull';
import { VerticalWindSpeed } from '../Charts/VerticalWindSpeed';
import ExclusionEolicService from '../services/ExclusionEolicService';
import {Spinner} from "@nextui-org/spinner";

interface EolicWindMapData {
  daily_wind_temp: any;
  wind_rose: any;
  weibull_distribution: any;
  wind_profile: any;
}
const SidebarEolicResources = ({isOpen, onCancel,eolicResourcesdata}) => {
  
  const CarouselAny = Carousel as any;  
    const [eolicWindMapData, setEolicWindMapData] = useState<EolicWindMapData | null>(null);

    const getEolicResources = () => { 
      const body = {
          "lat": eolicResourcesdata.lat,
          "lng": eolicResourcesdata.lng,
          "z": 50
      };
      ExclusionEolicService.getExclusionResourcesMap(body).then((response) => {
          if (response.status === 200) {
          setEolicWindMapData(response.data);
          }
          else {
          throw new Error(response.data);
          }
      });
  }

    useEffect(() => {
        // Esta función se ejecutará cada vez que eolicResourcesdata cambie
        if (eolicResourcesdata && eolicResourcesdata.lat && eolicResourcesdata.lng) {
          getEolicResources();
      } else {
          console.log('eolicResourcesdata no está definido o no tiene lat/lng');
      }
      }, [eolicResourcesdata]);

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
        <CarouselAny
                showArrows={true} 
                autoPlay={false} 
                infiniteLoop={true} 
                showThumbs={false}
                showStatus={false}
                interval={3000}
                renderIndicator={renderIndicator}
                
            >
              {eolicWindMapData ? (<div>
                <div>
                <FrequencyWindSpeed  eolicWindMapData={eolicWindMapData.daily_wind_temp}/> 
                </div>
                <div>
                <WindRose eolicWindMapData={eolicWindMapData.wind_rose}/> 
                </div>
                <div>
                  <Weibull eolicWindMapData={eolicWindMapData.weibull_distribution}/>
                </div>
                <div>
                  <VerticalWindSpeed eolicWindMapData={eolicWindMapData.wind_profile}/> 
                </div>
                </div>
                ): 
                <div>
                  <div className='mb-2 h-10' >Cargando... el proceso puede tardar unos segundos...</div>
                  <Spinner />
                </div> }
                
            </CarouselAny>
        </div>
        </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SidebarEolicResources;