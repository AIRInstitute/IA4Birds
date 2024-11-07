import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import {Spinner} from "@nextui-org/spinner";

interface EolicWindMapData {
  data: {
    densityData: number[];
    frequencyData: number[];
    y: number[];
  }
}

interface FrequencyWindSpeedProps {
  eolicWindMapData?: EolicWindMapData;
}

export const Weibull: React.FC<FrequencyWindSpeedProps> = ({ eolicWindMapData }) => {
  console.log('Weibull eolicWindMapData: ', eolicWindMapData)
  
  const [series, setSeries] = useState([
    {
      name: 'Densidad',
      type: 'line',
      data: [] as number [] // Datos de densidad serán dinámicos
    }, 
    {
      name: 'Frecuencia',
      type: 'column',
      data:  [] as number [] // Datos de frecuencia serán dinámicos
    }
  ]);
  const [options, setOptions] = useState<any>({
          chart: {
            height: 350,
            type: 'line',
          },
          stroke: {
            width: [4, 0]
          },
          title: {
            text: 'Distribución de Frecuencia y Densidad en función de la Velocidad'
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [0, 1] // Habilita etiquetas en ambas series
          },
          xaxis: {
            categories: [0,
              0.25,
              0.5,
              0.75,
              1,
              1.25,
              1.5,
              1.75,
              2,
              2.25,
              2.5,
              2.75,
              3,
              3.25,
              3.5,
              3.75,
              4,
              4.25,
              4.5,
              4.75,
              5,
              5.25,
              5.5,
              5.75,
              6,
              6.25,
              6.5,
              6.75,
              7,
              7.25,
              7.5,
              7.75,
              8,
              8.25,
              8.5,
              8.75,
              9,
              9.25,
              9.5,
              9.75,
              10,
              10.25,
              10.5,
              10.75,
              11,
              11.25,
              11.5,
              11.75,
              12,
              12.25,
              12.5,
              12.75,
              13,
              13.25,
              13.5,
              13.75,
              14,
              14.25,
              14.5,
              14.75,
              15,
              15.25,
              15.5,
              15.75,
              16,
              16.25,
              16.5,
              16.75,
              17,
              17.25,
              17.5,
              17.75,
              18,
              18.25,
              18.5,
              18.75,
              19,
              19.25,
              19.5,
              19.75], // Valores de velocidad
            title: {
              text: 'Velocidad (m/s)'
            },
          },
          yaxis: [{
            title: {
              text: 'Densidad (kg/m³)'
            },
          }, {
            opposite: true,
            title: {
              text: 'Frecuencia'
            }
          }],
          tooltip: {
            shared: true,
            intersect: false
          },
          legend: {
            position: 'top'
          }
        });

      useEffect(() => {
        console.log("eolicWindMapData dentro del componente setSeries ", eolicWindMapData)
        if (eolicWindMapData != undefined) {
          const densityData = eolicWindMapData.data.y.map(value => parseFloat(value.toFixed(4)));
          setSeries([
            {
              name: 'Densidad',
              type: 'line',
              data: densityData
            },
            {
              name: 'Frecuencia',
              type: 'column',
              data: densityData
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