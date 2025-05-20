import React, { useState, useEffect } from 'react';
import { Spacer } from "@nextui-org/spacer";
import { CustomCardCamera } from './card/AdminPanelCameraCard';
import { CustomCardData } from './card/AdminPanelDataCard';
import bird from './services/BirdDataService';
import xenocanto from './services/XenocantoDataService';
import CameraService from "./services/CameraDataService";
import eolic from './services/ExclusionEolicService';

const AdminPanelComponent = () => {
  interface PanelAdminData {
    id: number;
    name: string;
    data: any;
  }

  const [xenocantoData, setXenocantoData] = useState<PanelAdminData | null>(null);
  const [ebirdData, setEbirdData] = useState<PanelAdminData | null>(null);
  const [eolicData, setEolicData] = useState<PanelAdminData | null>(null);
  const [cameraAdminData, setCameraAdminData] = useState<any[]>([]);

  const [loadingXeno, setLoadingXeno] = useState(true);
  const [loadingEbird, setLoadingEbird] = useState(true);
  const [loadingEolic, setLoadingEolic] = useState(true);
  const [loadingCamera, setLoadingCamera] = useState(true);

  const [errorXeno, setErrorXeno] = useState<string | null>(null);
  const [errorEbird, setErrorEbird] = useState<string | null>(null);
  const [errorEolic, setErrorEolic] = useState<string | null>(null);
  const [errorCamera, setErrorCamera] = useState<string | null>(null);

  useEffect(() => {
    const fetchXenocanto = async () => {
      try {
        const res = await xenocanto.getXenocanto();
        setXenocantoData({ id: 1, name: 'Xenocanto', data: res.data });
      } catch (err) {
        console.error("Error cargando Xenocanto:", err);
        setErrorXeno("No se han podido obtener los datos de Xenocanto");
      } finally {
        setLoadingXeno(false);
      }
    };

    const fetchEbird = async () => {
      try {
        const res = await bird.getExclusionMap();
        setEbirdData({ id: 2, name: 'eBird', data: res.data });
      } catch (err) {
        console.error("Error cargando eBird:", err);
        setErrorEbird("No se han podido obtener los datos de eBird");
      } finally {
        setLoadingEbird(false);
      }
    };

    const fetchEolic = async () => {
      try {
        const res = await eolic.getExclusionMapAll();
        setEolicData({ id: 3, name: 'Exclusión Eólica', data: res.data });
      } catch (err) {
        console.error("Error cargando Exclusión Eólica:", err);
        setErrorEolic("No se han podido obtener los datos de Exclusión Eólica");
      } finally {
        setLoadingEolic(false);
      }
    };

    const fetchCameras = async () => {
      try {
        const res = await CameraService.getAllCamera();
        setCameraAdminData(res);
      } catch (err) {
        console.error("Error cargando cámaras:", err);
        setErrorCamera("No se han podido obtener los datos de las cámaras");
      } finally {
        setLoadingCamera(false);
      }
    };

    // Llamadas paralelas
    fetchXenocanto();
    fetchEbird();
    fetchEolic();
    fetchCameras();
  }, []);

  return (
    <div className="admin-panel">
      <Spacer y={5} />
      <div className="flex justify-between gap-2 w-full px-6 lg:flex-row flex-col">

        {/* Cámaras */}
        <div className="card-container flex-grow lg:w-1/2 w-full">
          {loadingCamera ? (
            <p>Cargando cámaras...</p>
          ) : errorCamera ? (
            <p>{errorCamera}</p>
          ) : (
            <CustomCardCamera cameraAdminData={cameraAdminData} />
          )}
        </div>

        {/* Datos científicos */}
        <div className="card-container flex-grow lg:w-1/2 w-full space-y-4">
          {loadingXeno && loadingEbird && loadingEolic ? (
            <p>Cargando datos científicos...</p>
          ) : (
            <CustomCardData
              panelAdminData={[
                xenocantoData || { id: 1, name: 'Xenocanto', data: { error: errorXeno || 'No disponible' } },
                ebirdData || { id: 2, name: 'eBird', data: { error: errorEbird || 'No disponible' } },
                eolicData || { id: 3, name: 'Exclusión Eólica', data: { error: errorEolic || 'No disponible' } },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelComponent;
