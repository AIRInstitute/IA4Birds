import * as React from 'react';
import { CustomCard } from './card/DataPanelCard';

const DataPanelComponent = () => {

    const [selectedData, setSelectedData] = React.useState(1);

    const dataPanelData = [
        { id: 1, name: 'Xenocanto', data: 'Aquí van los datos de Xenocanto'},
        { id: 2, name: 'eBird', data: 'Aquí van los datos de eBird'},
    ];

    const handleDropdownChange = (event) => {
        setSelectedData(Number(event.target.value)); // Update the selected data ID
    };


    return (
        <div className="data-panel-container">
            <div className="w-full flex justify-end">
                <select onChange={handleDropdownChange} value={selectedData} className="mr-6 mb-4 cursor-pointer">
                    {dataPanelData.map(item => (
                        <option key={item.id} value={item.id}>
                        {item.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="card-container flex-grow mx-5">
                <CustomCard dataPanelData={dataPanelData} />
            </div>
        </div>
      );
};

export default DataPanelComponent;