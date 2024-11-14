import * as React from 'react';
import { CustomCard } from './card/DataPanelCard';

const DataPanelComponent = () => {

    const dataPanelData = [
        { id: 1, name: 'Xenocanto', data: 'Aquí van los datos de Xenocanto'},
        { id: 2, name: 'eBird', data: 'Aquí van los datos de eBird'},
    ];


    return (
        <div className="data-panel-container">
            <div className="card-container flex-grow mx-5">
                <CustomCard dataPanelData={dataPanelData} />
            </div>
        </div>
      );
};

export default DataPanelComponent;