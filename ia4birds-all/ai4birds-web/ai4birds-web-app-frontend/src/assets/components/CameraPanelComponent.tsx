import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomCard } from './card/CameraPanelCard';
import CameraService from './services/CameraDataService';

// Define Camera type (igual que en el resto del proyecto)
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
};

const CameraPanelComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('camera');
  const selectedDataFromQuery = Number(queryParam);
  const [selectedCamera, setSelectedCamera] = React.useState<Camera | null>(null);
  const [allCameras, setAllCameras] = React.useState<Camera[]>([]);

  // Fetch all cameras once to populate the dropdown
  React.useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await CameraService.getAllCamera();
        setAllCameras(data);

        const validCamera = data.find(cam => cam.id === selectedDataFromQuery);
        const selectedId = validCamera ? selectedDataFromQuery : data[0]?.id || 1;

        setSearchParams({ camera: selectedId.toString() });
        fetchCameraById(selectedId);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, []);

  // Fetch a single camera when the param changes
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

  return (
    <div className="camera-panel-container">
      <div className="w-full flex justify-end">
        <select onChange={handleDropdownChange} value={selectedCamera?.id || ""} className="mr-6 mb-2 cursor-pointer">
          {allCameras.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="card-container flex-grow mx-5">
        {selectedCamera && <CustomCard cameraPanelData={selectedCamera} />}
      </div>
    </div>
  );
};

export default CameraPanelComponent;
