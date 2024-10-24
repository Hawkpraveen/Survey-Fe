import React, { useEffect, useState } from "react";
import {
  LineChart as RechartsLineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import axios from "axios";

const ChartComponent = ({ surveyId }) => {
  const [userRatings, setUserRatings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    const fetchUserRatings = async () => {
      try {
        const response = await axios.get(
          `https://survey-be-5d9v.onrender.com/api/survey/survey-ratings/${surveyId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        // console.log(response.data);

        setUserRatings(response.data.userRatings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRatings();
  }, [surveyId, authToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  // Transform userRatings into a suitable format for the charts
  const chartData = userRatings.map((user) => ({
    name: user.userName,
    totalRating: user.totalRating,
  }));

  // Calculate height based on the number of responses, with a minimum height
  const chartHeight = Math.max(chartData.length * 50, 250);

  return (
    <div className="w-full h-full p-6">
      <h2 className="text-2xl font-bold text-center text-blue-500 mb-8">
        User Ratings
      </h2>

      <div className="mb-12">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalRating"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            >
              <LabelList dataKey="totalRating" position="top" />
            </Line>
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-xl font-semibold text-center mb-4">
        Bar Chart Representation
      </h3>

      <div>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalRating" fill="#82ca9d">
              <LabelList dataKey="totalRating" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;
