import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const PriceChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => new Date(d[0] * 1000).toLocaleDateString()),
    datasets: [
      {
        label: 'Bitcoin Price',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        data: data.map(d => ({
          x: new Date(d[0] * 1000),
          y: d[4]  // Closing prices
        }))
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        }
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (USD)'
        }
      }
    },
    elements: {
      point: {
        radius: 1  // Reducing point radius for a cleaner look
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default PriceChart;
