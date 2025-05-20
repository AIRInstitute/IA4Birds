import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { CustomCard } from "./card/DataPanelCard";
import bird from './services/BirdDataService';
import xenocanto from './services/XenocantoDataService';
import exclusionData from './services/ExclusionEolicService';

const DataPanelComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("data");
  const selectedDataFromQuery = Number(queryParam); // Convert queryParam to a number
  const [selectedData, setSelectedData] = React.useState(selectedDataFromQuery || 1);
  const [dataPanelData, setDataPanelData] = React.useState(null); // Data to render
  const [isLoading, setIsLoading] = React.useState(true); // Loading state
  const [error, setError] = React.useState(""); // Error state

  // Fetch data based on the selected data
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        let response;
        if (selectedData === 1) {
          response = await xenocanto.getXenocanto(); // Fetch Xenocanto data
        } else if (selectedData === 2) {
          response = await bird.getExclusionMap(); // Fetch eBird data
        }else if (selectedData === 3) {
          response = await exclusionData.getExclusionMapAll(); // Añade esta línea
        }
        if (response?.data) {
          setDataPanelData(response.data.data || response.data);
        } else {
          throw new Error("Respuesta inválida");
        }
      } catch (err) {
        setError("Error en la obtención de datos. Vuelva a intentarlo más tarde.");
        console.error("Error fetching data: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedData]);

  // Handle dropdown change
  const handleDropdownChange = (event) => {
    const selectedId = Number(event.target.value);
    setSelectedData(selectedId);
    setSearchParams({ data: selectedId.toString() }); // Update queryParam
  };

  return (
    <div className="data-panel-container">
      <div className="w-full flex justify-end">
        <select
          onChange={handleDropdownChange}
          value={selectedData}
          className="mr-6 mb-4 cursor-pointer"
        >
          <option value={1}>Xenocanto</option>
          <option value={2}>eBird</option>
          <option value={3}>Eolic Exclusion</option>
        </select>
      </div>
      <div className="card-container flex-grow mx-5">
        {isLoading ? (
          <p>Cargando datos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <CustomCard dataPanelData={dataPanelData} />
        )}
      </div>
    </div>
  );
};

export default DataPanelComponent;
