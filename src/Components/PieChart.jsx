import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ ratings, question }) => {
  const ratingValues = Object.values(ratings);
  const ratingLabels = Object.keys(ratings);

  const data = {
    labels: ratingLabels.map((label) => `Rating ${label}`),
    datasets: [
      {
        label: `Ratings for "${question}"`,
        data: ratingValues,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <div>
      <h3>{question}</h3>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
