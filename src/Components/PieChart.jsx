import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PieChartComponent = ({ ratings, question }) => {
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

  const totalRatings = ratingLabels.length; // Total number of ratings

  // Prepare the data for Recharts Pie component
  const pieData = ratingLabels.map((label, index) => ({
    name: `Rating ${label}`,
    value: ratingValues[index],
    color: getColor(parseInt(label), totalRatings),
  }));

  return (
    <div className="text-center w-full h-96">
      <h3 className="text-lg font-semibold mb-2">{question}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
