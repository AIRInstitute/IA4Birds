import * as React from 'react';
import { CustomCard } from './card/CameraPanelCard';

const CameraPanelComponent = () => {

    const cameraPanelData = [
    { id: 1, name: 'Camera 1', location: '', views: '23 views', url: '/public/Buitre negro.jpg'},
    { id: 2, name: 'Camera 2', location: '', views: '100 views', url: '/public/Buitre negro.jpg'},
    { id: 3, name: 'Camera 3', location: '', views: '50 views', url: '/public/Buitre negro.jpg'},
    
    ];

    return (
        <div className="camera-panel-container">
            <div className="card-container flex-grow mx-5">
                <CustomCard cameraPanelData={cameraPanelData} />
            </div>
        </div>
    );
};
    

export default CameraPanelComponent;