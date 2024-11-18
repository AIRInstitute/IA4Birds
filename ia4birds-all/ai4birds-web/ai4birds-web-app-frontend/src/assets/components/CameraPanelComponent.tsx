import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomCard } from './card/CameraPanelCard';

const CameraPanelComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('camera');
    const selectedDataFromQuery = Number(queryParam); // Convert queryParam to a number
    const [selectedData, setSelectedData] = React.useState(selectedDataFromQuery || 1);

    const cameraPanelData = [
        { id: 1, name: 'Camera 1', location: '', views: '23 views', url: '/public/Buitre negro.jpg' },
        { id: 2, name: 'Camera 2', location: '', views: '100 views', url: '/public/Buitre negro.jpg' },
        { id: 3, name: 'Camera 3', location: '', views: '50 views', url: '/public/Buitre negro.jpg' },
        { id: 4, name: 'Camera 4', location: '', views: '500 views', url: '/public/Buitre negro.jpg' },
    ];

    React.useEffect(() => {
        const isValidNumber = !isNaN(selectedDataFromQuery) && Number.isInteger(selectedDataFromQuery);
        const isValidCamera = cameraPanelData.some(item => item.id === selectedDataFromQuery);

        // Redirect if the query param is invalid (non-numeric or out of range)
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