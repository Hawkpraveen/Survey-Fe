import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({ ratings, question }) => {
  const ratingValues = Object.values(ratings);
  const ratingLabels = Object.keys(ratings);

  // Prepare data in the format Recharts requires
  const barData = ratingLabels.map((label, index) => ({
    name: `Rating ${label}`,
    value: ratingValues[index],
  }));

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">{question}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} /> {/* Ensure Y-axis only has whole numbers */}
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="rgba(75, 192, 192, 0.6)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
