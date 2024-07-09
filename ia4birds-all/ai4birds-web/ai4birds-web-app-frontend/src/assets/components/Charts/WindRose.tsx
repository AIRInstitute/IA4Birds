import React, {useState, useEffect} from "react";
import { Chart } from "react-windrose-chart";
import {Spinner} from "@nextui-org/react";


export const WindRose = ({eolicWindMapData}) => {
   console.log("WindRoseeee",eolicWindMapData);
   const [chartDataWindRose, setChartData] = useState<any>([]);
  const data = {
    columns: [
      "angle",
      "0-3",
      "3-6",
      "6-9",
      "9-12",
      "12-15",
      "15-18",
      "> 18",
    ],
  };

  useEffect(() => {
    if (eolicWindMapData && eolicWindMapData.data.chartData) {
      setChartData(eolicWindMapData.data.chartData
      );

      console.log("eolicWindMapData WindRose",eolicWindMapData.data.chartData)
      console.log("setChartData",chartDataWindRose);
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
            <div className='mb-2' >Loading...</div>
            <Spinner />
          </>
        )}
    
  </div> )
  
  };