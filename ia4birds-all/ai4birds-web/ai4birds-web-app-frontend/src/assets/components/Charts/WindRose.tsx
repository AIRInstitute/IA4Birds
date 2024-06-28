
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';

interface EolicWindMapData {
  data: {
    y: number[];
  };
}
interface WindRoseProps {
  eolicWindMapData?: EolicWindMapData;
}

export const WindRose : React.FC<WindRoseProps> = ({ eolicWindMapData }) => {
    const [state] = useState( {
        series: [14, 23, 21, 17, 15, 10, 12],
        options: {
          chart: {
            type: 'polarArea',
          },
          title: {
            text: 'Rosa de vientos a la altura seleccionada'
          },
          stroke: {
            colors: ['#fff'],
          },
          labels: ['0-3 m/s', '3-6 m/s', '6-9 m/s', '9-12 m/s', '12-15 m/s', '15-18 m/s', '> 18  m/s'],
          fill: {
            opacity: 0.8,
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        },
      })

    return (
        <div>
        <div id="chart">
          <ReactApexChart options={state.options} series={state.series} type="polarArea" />
        </div>
        <div id="html-dist"></div>
      </div>
    
    );}