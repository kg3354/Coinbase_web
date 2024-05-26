import React, { useEffect, useRef } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register necessary components for Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Filler
);

const PriceChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Ensure to destroy the existing chart instance if it exists
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => new Date(d[0] * 1000)), // Assuming d[0] is the timestamp in seconds
        datasets: [{
          label: 'Bitcoin Price',
          data: data.map(d => ({
            x: new Date(d[0] * 1000),
            y: d[4]  // Assuming d[4] is the price
          })),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'yyyy-MM-dd'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Price (USD)'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Cleanup the chart instance on component unmount
      }
    };
  }, [data]); // Re-run effect only if 'data' changes

  return <canvas ref={chartRef}></canvas>;
};

export default PriceChart;
