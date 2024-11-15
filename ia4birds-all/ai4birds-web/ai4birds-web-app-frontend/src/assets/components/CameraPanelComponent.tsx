import * as React from 'react';
import { CustomCard } from './card/CameraPanelCard';

const CameraPanelComponent = () => {

    const [selectedData, setSelectedData] = React.useState(1);

    const cameraPanelData = [
    { id: 1, name: 'Camera 1', location: '', views: '23 views', url: '/public/Buitre negro.jpg'},
    { id: 2, name: 'Camera 2', location: '', views: '100 views', url: '/public/Buitre negro.jpg'},
    { id: 3, name: 'Camera 3', location: '', views: '50 views', url: '/public/Buitre negro.jpg'},
    
    ];

    const handleDropdownChange = (event) => {
        setSelectedData(Number(event.target.value)); // Update the selected data ID
    };


    return (
        <div className="camera-panel-container">
            <div className="w-full flex justify-end">
                <select onChange={handleDropdownChange} value={selectedData} className="mr-6 mb-4 cursor-pointer">
                    {cameraPanelData.map(item => (
                        <option key={item.id} value={item.id}>
                        {item.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="card-container flex-grow mx-5">
                <CustomCard cameraPanelData={cameraPanelData} />
            </div>
        </div>
    );
};
    

export default CameraPanelComponent;