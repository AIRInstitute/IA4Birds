import * as React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CustomCardCamera } from './card/CameraPanelCard';
import { CustomCardCameraTable } from './card/CameraPanelCardTable';
import { CustomCardCameraHeatMap } from './card/CameraPanelCardHeatMap';
import CameraService from './services/CameraDataService';

type Camera = {
  id: number;
  name: string;
  source_url: string;
  source_type: string;
  location?: string;
  playback_url?: string;
  status: "active" | "inactive" | "pending";
  latitude?: string;
  longitude?: string;
  storage_info?: string;
  additional_data?: string;
  is_public: boolean;
};

const CameraPanelComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('camera');
  const selectedDataFromQuery = Number(queryParam);
  const [selectedCamera, setSelectedCamera] = React.useState<Camera | null>(null);
  const [allCameras, setAllCameras] = React.useState<Camera[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchCameras = async () => {
      try {
        //const data = await CameraService.getAllCamera();
        const data = await CameraService.getAccessibleCameras();
        setAllCameras(data);

        const validCamera = data.find(cam => cam.id === selectedDataFromQuery);
        const selectedId = validCamera ? selectedDataFromQuery : data[0]?.id || (data.length > 0 ? data[0].id : null);

        if (selectedId !== null) {
          setSearchParams({ camera: selectedId.toString() });
          fetchCameraById(selectedId);
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, [selectedDataFromQuery, setSearchParams]);

  const fetchCameraById = async (id: number) => {
    try {
      const camera = await CameraService.getCameraById(id);
      setSelectedCamera(camera);
    } catch (error) {
      console.error("Error fetching camera by ID:", error);
    }
  };

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    setSearchParams({ camera: selectedId.toString() });
    fetchCameraById(selectedId);
  };

  const handleDeleteCamera = async (idToDelete: number, nameToDelete: string) => {
    if (window.confirm(`¿Estás seguro de que quieres borrar la cámara "${nameToDelete}"?`)) {
      try {
        await CameraService.deleteCamera(idToDelete);
        console.log(`Cámara con ID ${idToDelete} borrada.`);
        navigate('/camera-component');
      } catch (error) {
        console.error("Error deleting camera:", error);
      }
    }
  };

  return (
    <div className="camera-panel-container">
      <div className="w-full flex justify-end items-center mb-2">
        <select
          onChange={handleDropdownChange}
          value={selectedCamera?.id || ""}
          className="cursor-pointer mr-6 "
        >
          {allCameras.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="card-container flex-grow mx-5">
        {selectedCamera && (
          <>
            <CustomCardCamera cameraPanelData={selectedCamera} onDelete={handleDeleteCamera} />
            <CustomCardCameraTable cameraPanelData={selectedCamera} onDelete={handleDeleteCamera} />
            <CustomCardCameraHeatMap cameraPanelData={selectedCamera} onDelete={handleDeleteCamera} />
          </>
        )}
        {!selectedCamera && allCameras.length > 0 && <p className="text-center text-gray-500">Selecciona una cámara del desplegable.</p>}
        {!selectedCamera && allCameras.length === 0 && <p className="text-center text-gray-500">No hay cámaras disponibles.</p>}
      </div>
    </div>
  );
};

export default CameraPanelComponent;
