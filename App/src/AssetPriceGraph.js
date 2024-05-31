import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AssetPriceGraph = ({ baseCurrency, quoteCurrency, startDate, endDate, setEndDate, granularity, onGranularityError }) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: `${baseCurrency}-${quoteCurrency} Price`,
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://${window.location.hostname}:3000/api/prices`, {

          params: {
            start: moment(startDate).tz('UTC').format(),
            end: moment(endDate).tz('UTC').format(),
            granularity: granularity,
            asset: `${baseCurrency}-${quoteCurrency}`
          }
        });
        if (response.data) {
          const prices = response.data.map(d => ({
            t: moment.utc(d[0] * 1000).local().format('YYYY-MM-DD HH:mm:ss'),
            y: (d[3] + d[4]) / 2 // average of opening and closing prices
          }));

          prices.reverse();

          setData({
            labels: prices.map(p => p.t),
            datasets: [{
              label: `${baseCurrency}-${quoteCurrency} Price`,
              data: prices.map(p => p.y),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }]
          });
          setError('');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response ? error.response.data.message : 'Error fetching data');
        if (error.response && error.response.data.message.includes('Count of aggregations requested exceeds 300')) {
          onGranularityError();
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh data every 30 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [baseCurrency, quoteCurrency, startDate, endDate, granularity, onGranularityError]);

  const handleSetNow = () => {
    const now = moment().format('YYYY-MM-DDTHH:mm');
    setEndDate(now); // Update endDate state in parent component to now
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={handleSetNow}>Set End Date to Now</button>
      <Line data={data} />
    </div>
  );
};

export default AssetPriceGraph;
