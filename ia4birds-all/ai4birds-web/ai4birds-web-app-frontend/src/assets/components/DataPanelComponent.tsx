import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomCard } from './card/DataPanelCard';

const DataPanelComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('data');
    const selectedDataFromQuery = Number(queryParam); // Convert queryParam to a number
    const [selectedData, setSelectedData] = React.useState(selectedDataFromQuery || 1);

    const dataPanelData = [
            { 
              id: 1, 
              name: 'Xenocanto', 
              data:  {
                description: 'A platform for sharing bird sounds.',
                recordings: 15230,
                regionsCovered: ['Americas', 'Europe', 'Asia', 'Africa'],
                website: 'https://xenocanto.org',
                a: 'A global birdwatching database.',
                b: 950000,
                c: 52000,
                d: 'https://ebird.org',
                e: 'A global birdwatching database.',
                f: 950000,
                g: 52000,
                h: 'https://ebird.org',
                i: 'A global birdwatching database.',
                k: 950000,
                j: 52000,
                l: 'https://ebird.org',
                m: 'A global birdwatching database.',
                n: 950000,
                o: 52000,
                p: 'https://ebird.org',
                q: 'A global birdwatching database.',
                r: 950000,
                s: 52000,
                t: 'https://ebird.org',
              }
            },
            {
              id: 2,
              name: 'eBird',
              data: {
                description: 'A global birdwatching database.',
                sightingsLogged: 950000,
                contributors: 52000,
                website: 'https://ebird.org',
                a: 'A global birdwatching database.',
                b: 950000,
                c: 52000,
                d: 'https://ebird.org',
                e: 'A global birdwatching database.',
                f: 950000,
                g: 52000,
                h: 'https://ebird.org',
                i: 'A global birdwatching database.',
                k: 950000,
                j: 52000,
                l: 'https://ebird.org',
                m: 'A global birdwatching database.',
                n: 950000,
                o: 52000,
                p: 'https://ebird.org',
                q: 'A global birdwatching database.',
                r: 950000,
                s: 52000,
                t: 'https://ebird.org',
              }
            },
        ];

    // Validate the query param for data and redirect if it's invalid
    React.useEffect(() => {
        const isValidNumber = !isNaN(selectedDataFromQuery) && Number.isInteger(selectedDataFromQuery);
        const isValidData = dataPanelData.some(item => item.id === selectedDataFromQuery);

        if (!isValidNumber || !isValidData) {
            setSearchParams({ data: '1' }); // Redirect to default (ID 1)
        } else {
            setSelectedData(selectedDataFromQuery);
        }
    }, [selectedDataFromQuery, setSearchParams, dataPanelData]);

    const handleDropdownChange = (event) => {
        const selectedId = Number(event.target.value);
        setSelectedData(selectedId);
        setSearchParams({ data: selectedId.toString() }); // Update the queryParam
    };

    const selectedDataItem = dataPanelData.find(item => item.id === selectedData);

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
                {selectedDataItem && (
                    <CustomCard dataPanelData={selectedDataItem} />
                )}
            </div>
        </div>
    );
};

export default DataPanelComponent;