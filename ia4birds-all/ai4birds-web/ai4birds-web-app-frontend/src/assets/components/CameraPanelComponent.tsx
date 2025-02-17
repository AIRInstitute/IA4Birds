import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomCard } from './card/CameraPanelCard';

const CameraPanelComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('camera');
    const selectedDataFromQuery = Number(queryParam); // Convert queryParam to a number
    const [selectedData, setSelectedData] = React.useState(selectedDataFromQuery || 1);

    const cameraPanelData = [
        { id: 1, name: 'Cámara 1', location: '', views: '273 visitas', gpsData: "Latitud: 40.416775, Longitud: -3.703790", storageData: "15.5", status: "Activa", url: "http://ia4birds-pre.der.usal.es:8083/hls/129d9c94-e321-4c69-b7b6-8dd7bd6d8d56/index.m3u8" },
        { id: 2, name: 'Cámara 2', location: '', views: '100 visitas', gpsData: "N/A", storageData: "N/A", status: "Inactiva", url: '' },
        { id: 3, name: 'Cámara 3', location: '', views: '50 visitas', gpsData: "N/A", storageData: "N/A", status: "Inactiva", url: '' },
        { id: 4, name: 'Cámara 4', location: '', views: '500 visitas', gpsData: "N/A", storageData: "N/A", status: "Inactiva", url: '' }, 
    ];

    React.useEffect(() => {
        const isValidNumber = !isNaN(selectedDataFromQuery) && Number.isInteger(selectedDataFromQuery);
        const isValidCamera = cameraPanelData.some(item => item.id === selectedDataFromQuery);

        if (!isValidNumber || !isValidCamera) {
            setSearchParams({ camera: '1' }); // Redirect to camera 1
        } else {
            setSelectedData(selectedDataFromQuery);
        }
    }, [selectedDataFromQuery, setSearchParams, cameraPanelData]);

    const handleDropdownChange = (event) => {
        const selectedId = Number(event.target.value);
        setSelectedData(selectedId);
        setSearchParams({ camera: selectedId.toString() }); // Update the queryParam
    };

    const selectedCamera = cameraPanelData.find(item => item.id === selectedData);

    return (
        <div className="camera-panel-container">
            <div className="w-full flex justify-end">
                <select onChange={handleDropdownChange} value={selectedData} className="mr-6 mb-2 cursor-pointer">
                    {cameraPanelData.map(item => (
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