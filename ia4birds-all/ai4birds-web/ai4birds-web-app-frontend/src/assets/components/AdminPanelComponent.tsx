import * as React from 'react';
import { Spacer } from "@nextui-org/spacer";
import { CustomCardCamera } from './card/AdminPanelCameraCard';
import { CustomCardData } from './card/AdminPanelDataCard';

const AdminPanelComponent = () => {
  // Sample data for each card
  // const cameraAdminData = {
  //   Name: "Camera 1",
  //   Location: "Avenida Madrigal",
  //   Views: "23 views",
  //   Status: "Online"
  // };

  const panelAdminData = [
    { id: 1, name: 'Xenocanto', data: 'Aquí van los datos de Xenocanto'},
    { id: 2, name: 'eBird', data: 'Aquí van los datos de eBird'},
  ];
  const cameraAdminData = [
    { id: 1, name: 'Camera 1', location: '', views: '23 views', url: '/public/Buitre negro.jpg'},
    { id: 2, name: 'Camera 2', location: '', views: '100 views', url: '/public/Buitre negro.jpg'},
    { id: 3, name: 'Camera 3', location: '', views: '50 views', url: '/public/Buitre negro.jpg'},
    
  ];

  return (
    <div className="admin-panel">
      <Spacer y={5} />
      <div className="flex justify-between gap-2 w-full px-6 ">
        
        <div className="card-container flex-grow w-1/2">
          <CustomCardCamera cameraAdminData={cameraAdminData} />
        </div>

        <div className="card-container flex-grow w-1/2">
          <CustomCardData panelAdminData={panelAdminData} />
        </div>
      </div>
    </div>

  );
};

export default AdminPanelComponent;
