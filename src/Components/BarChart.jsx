import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ ratings, question }) => {
  const ratingValues = Object.values(ratings);
  const ratingLabels = Object.keys(ratings);

  const data = {
    labels: ratingLabels.map((label) => `Rating ${label}`),
    datasets: [
      {
        label: `Ratings for "${question}"`,
        data: ratingValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h3>{question}</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
