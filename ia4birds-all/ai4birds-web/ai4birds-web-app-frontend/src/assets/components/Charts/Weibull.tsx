import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';

export const Weibull = () => {
    const [state] = useState({
        series: [{
          name: 'Densidad',
          type: 'line',
          data: [10, 20, 15, 25, 30, 45, 50, 60, 55, 70, 80, 90] // Datos de densidad
        }, {
          name: 'Frecuencia',
          type: 'column',
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160] // Datos de frecuencia
        }],
        options: {
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
            categories: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60], // Valores de velocidad
            title: {
              text: 'Velocidad (m/s)'
            }
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
        }
      });

    return (
        <div>
        <div id="chart">
            <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
        </div>
        <div id="html-dist"></div>
    </div>
    
    );}