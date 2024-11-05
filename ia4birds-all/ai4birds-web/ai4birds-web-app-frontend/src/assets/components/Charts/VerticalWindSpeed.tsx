
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';
import {Spinner} from "@nextui-org/react";
interface EolicWindMapData {
  data: {
    y: number[];
  };
}

interface VerticalWindSpeedProps {
  eolicWindMapData?: EolicWindMapData;
}


export const VerticalWindSpeed: React.FC<VerticalWindSpeedProps> = ({ eolicWindMapData }) => {
  
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: 'Perfil vertical medio de la velocidad del viento',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      tickAmount: 16,
      categories: [
        3.7192333023911104,
        5.012498209992426,
        5.448314119493734,
        5.767977059103645,
        6.2138928844228785,
        6.5247077774385795
      ],
      labels: {
        formatter: function (val) {
          if (val === undefined) return val;
          return val.toFixed(2) + "m";
        }
      }
      
    },
    yaxis: {
      title: {
        text: 'Altura (m)'
      },
    },
  });

  useEffect(() => {
    if (eolicWindMapData && eolicWindMapData.data && eolicWindMapData.data.subplot.y) {
      setSeries([
        {
          name: 'Altura',
          data: eolicWindMapData.data.subplot.y
        }
      ]);
    }
  }, [eolicWindMapData]);

    return (
        <div>
        <div id="chart">
        {eolicWindMapData ? (
          <ReactApexChart options={options} series={series} type="line" height={350} />
        ) : (
          <>
            <div className='mb-2' >Cargando... el proceso puede tardar unos segundos...</div>
            <Spinner />
          </>
        )}
        </div>
        <div id="html-dist"></div>
      </div>
    
    );}