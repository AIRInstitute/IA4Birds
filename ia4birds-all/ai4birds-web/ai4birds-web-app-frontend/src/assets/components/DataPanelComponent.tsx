import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { CustomCard } from "./card/DataPanelCard";
import bird from './services/BirdDataService';
import xenocanto from './services/XenocantoDataService';
import exclusionData from './services/ExclusionEolicService';

const DataPanelComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("data");
  const selectedDataFromQuery = Number(queryParam);
  const [selectedData, setSelectedData] = React.useState(selectedDataFromQuery || 1);
  const [dataPanelData, setDataPanelData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");


  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        let response;
        if (selectedData === 1) {
          response = await xenocanto.getXenocanto();
        } else if (selectedData === 2) {
          response = await bird.getExclusionMap();
        }else if (selectedData === 3) {
          response = await exclusionData.getExclusionMapAll();
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


  const handleDropdownChange = (event) => {
    const selectedId = Number(event.target.value);
    setSelectedData(selectedId);
    setSearchParams({ data: selectedId.toString() });
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
