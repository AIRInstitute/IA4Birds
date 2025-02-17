import React, { useState, useEffect } from 'react';
import { Spacer } from "@nextui-org/spacer";
import { CustomCardCamera } from './card/AdminPanelCameraCard';
import { CustomCardData } from './card/AdminPanelDataCard';
import bird from './services/BirdDataService';
import xenocanto from './services/XenocantoDataService';

const AdminPanelComponent = () => {
  interface PanelAdminData {
    id: number;
    name: string;
    data: any;
  }

  const [panelAdminData, setPanelAdminData] = useState<PanelAdminData[]>([]);
  const [cameraAdminData] = useState([
    { id: 1, name: 'Cámara 1', location: '', views: '273 visitas', gpsData: "Latitud: 40.416775, Longitud: -3.703790", storageData: "15.5", status: "Activa", url: '/public/playVideo.png' },
    { id: 2, name: 'Cámara 2', location: '', views: '100 visitas', gpsData: "N/A", storageData: "N/A", status: "Inactiva", url: '/public/playVideo.png' },
    { id: 3, name: 'Cámara 3', location: '', views: '50 visitas', gpsData: "N/A", storageData: "N/A", status: "Inactiva", url: '/public/playVideo.png' },
    { id: 4, name: 'Cámara 4', location: '', views: '500 visitas', gpsData: "N/A", storageData: "N/A", status: "Inactiva", url: '/public/playVideo.png' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exclusionResponse = await bird.getExclusionMap();
        const xenocantoResponse = await xenocanto.getXenocanto();

        setPanelAdminData([
          {
            id: 1,
            name: 'Xenocanto',
            data: xenocantoResponse.data, 
          },
          {
            id: 2,
            name: 'eBird',
            data: exclusionResponse.data, 
          },
        ]);
      } catch (err) {
        // console.error("Error fetching data:", err);
        // setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-panel">
      <Spacer y={5} />
      <div className="flex justify-between gap-2 w-full px-6 lg:flex-row flex-col">
        <div className="card-container flex-grow lg:w-1/2 w-full">
          <CustomCardCamera cameraAdminData={cameraAdminData} />
        </div>

        <div className="card-container flex-grow lg:w-1/2 w-full">
          <CustomCardData panelAdminData={panelAdminData} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanelComponent;
