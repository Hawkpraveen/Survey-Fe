import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ ratings, question }) => {
  const ratingValues = Object.values(ratings);
  const ratingLabels = Object.keys(ratings);

  // Function to get color based on the rating
  const getColor = (rating, totalRatings) => {
    const midPoint = Math.ceil(totalRatings / 2);

    if (rating < midPoint) {
      // Dark to light red shades for ratings below midpoint
      return [
        "#660000", // Rating 1
        "#990000", // Rating 2
        "#CC0000", // Rating 3
        "#FF0000", // Rating 4
      ][rating - 1];
    } else if (rating === midPoint) {
      // Midpoint (mix of red and green)
      return "#FF7F00"; // Orange
    } else {
      // Light to dark green shades for ratings above midpoint
      return [
        "#CCFFCC", // Rating 6
        "#99FF99", // Rating 7
        "#66FF66", // Rating 8
        "#33FF33", // Rating 9
        "#00CC00", // Rating 10
      ][rating - midPoint - 1];
    }
  };

  // Generate labels and colors dynamically
  const labels = ratingLabels.map((label) => `Rating ${label}`);
  const totalRatings = ratingLabels.length; // Total number of ratings
  const backgroundColors = ratingLabels.map((label) =>
    getColor(parseInt(label), totalRatings)
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: `Ratings for "${question}"`,
        data: ratingValues,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors,
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
