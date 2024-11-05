import React, {useState, useEffect} from "react";
import { Chart } from "react-windrose-chart";
import {Spinner} from "@nextui-org/react";


export const WindRose = ({eolicWindMapData}) => {
   console.log("WindRoseeee",eolicWindMapData);
   const [chartDataWindRose, setChartData] = useState<any>([]);
   const formatDataWithUnits = (data) => {
    return data.map((item) => ({
      ...item,
      "0-3 m/s": item["0-3"],
      "3-6 m/s": item["3-6"],
      "6-9 m/s": item["6-9"],
      "9-12 m/s": item["9-12"],
      "12-15 m/s": item["12-15"],
      "15-18 m/s": item["15-18"],
      "> 18 m/s": item["> 18"],
    }));
  };

  const data = {
    columns: [
      "angle",
      "0-3 m/s",
      "3-6 m/s",
      "6-9 m/s",
      "9-12 m/s",
      "12-15 m/s",
      "15-18 m/s",
      "> 18 m/s",
    ],
  };

  useEffect(() => {
    if (eolicWindMapData && eolicWindMapData.data.chartData) {
      const formattedData = formatDataWithUnits(eolicWindMapData.data.chartData);
      setChartData(formattedData);
    }
  }, [eolicWindMapData]);

  return ( 
  <div>
    {chartDataWindRose.length > 0 ? (
          <Chart
          chartData={chartDataWindRose}
          columns={data.columns}
          responsive
          legendGap={10}
        />
        ) : (
          <>
            <div className='mb-2' >Cargando... el proceso puede tardar unos segundos...</div>
            <Spinner />
          </>
        )}
    
  </div> )
  
  };