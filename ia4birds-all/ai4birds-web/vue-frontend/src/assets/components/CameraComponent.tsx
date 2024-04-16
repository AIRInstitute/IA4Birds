import React, { useEffect } from "react";
import {Spacer} from "@nextui-org/react";
import {CustomCard} from "./card/cameraCard";
import XenocantoDataService from './services/XenocantoDataService';

const CameraComponent = () => {
    const camerasData = [
        { id: 1, name: 'Camera 1', location: 'Avenida Madrigal', views: '23 views', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrHm-9dQxCTmsSPkH5zZ9iijHXXX8MOHnnlQ&usqp=CAU'},
        { id: 2, name: 'Camera 2', location: '', views: '100 views', url: '/public/Buitre negro.jpg'},
        { id: 3, name: 'Camera 3', location: '', views: '50 views', url: '/public/Buitre negro.jpg'},
        
      ];
      useEffect(() => {
        // Esta función se ejecutará una vez cuando el componente se monte en el DOM
        console.log('La página se ha cargado cameraComponent');
        
        // Llama a tu función aquí
        getXenocantoData();
      }, []);

      const getXenocantoData = () => {
        XenocantoDataService.getXenocanto().then((response) => {
          if (response.status === 200) {
            console.log("Xenocanto Response",response.data)
          }
          else {
            throw new Error(response.data);
          }
        });
      };

  return (
    <>
    <div className="camera-component">
      <Spacer y={5} />
      <div className="flex flex-wrap justify-center gap-6">
        {camerasData.map ((camera) => (
          <React.Fragment key={camera.id}>
            <CustomCard cameraData = {camera}/>
            <Spacer x={4}/>
          </React.Fragment>
        ))}
      </div>
    </div>

    </>
  );
}

export default CameraComponent;
