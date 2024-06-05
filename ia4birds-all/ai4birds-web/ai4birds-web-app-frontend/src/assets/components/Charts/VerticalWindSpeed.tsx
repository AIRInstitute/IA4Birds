
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';

export const VerticalWindSpeed = () => {
    const [state] = useState( {
        series: [{
            name: "Desktops",
            data: [
                10,
                50,
                75,
                100,
                150,
                200
              ]
        }],
        options: {
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
            min: 0,
            max: 15,
            tickAmount: 16,
            categories: [
                3.7192333023911104,
                5.012498209992426,
                5.448314119493734,
                5.767977059103645,
                6.2138928844228785,
                6.5247077774385795
              ],
          },
          yaxis: {
            title: {
              text: 'Altura (m)'
            },
          }
        },
      })

    return (
        <div>
        <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    
    );}