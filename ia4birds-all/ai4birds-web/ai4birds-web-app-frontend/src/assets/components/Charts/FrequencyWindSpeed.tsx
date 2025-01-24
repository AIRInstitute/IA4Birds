import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import {Spinner} from "@nextui-org/spinner";

interface EolicWindMapData {
  data: {
    y: number[];
  };
}

interface FrequencyWindSpeedProps {
  eolicWindMapData?: EolicWindMapData;
}

export const FrequencyWindSpeed: React.FC<FrequencyWindSpeedProps> = ({ eolicWindMapData }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      type: 'bar',
      height: 350
    },
    title: {
      text: 'Perfil medio diario de la velocidad del viento'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      title: {
        text: 'Hora (UTC)'
      },
      categories: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
      ].map(hour => hour.toString().padStart(2, '0') + ":00")
    },
    yaxis: {
      title: {
        text: 'Velocidad del viento (m/s)'
      },
      labels: {
        formatter: function (val: number) {
          return val.toFixed(1); // Formateo a 1 decimal
        }
      },
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toFixed(1) + " m/s"; // Formateo a 1 decimal
        }
      }
    } 
  });

  useEffect(() => {
    if (eolicWindMapData && eolicWindMapData.data && eolicWindMapData.data.y) {
      setSeries([
        {
          name: 'Velocidad del viento',
          data: eolicWindMapData.data.y
        }
      ]);
    }
  }, [eolicWindMapData]);

  return (
    <div>
      <div id="chart">
        {eolicWindMapData ? (
          <ReactApexChart options={options} series={series} type="bar" height={350} />
        ) : (
          <div className='mb-2' style={{ minHeight: '440px' }}>
            <div className='mb-2' >Cargando... el proceso puede tardar unos segundos...</div>
            <Spinner />
          </div>
        )}
      </div>
      <div id="html-dist"></div>
    </div>
  );
};
