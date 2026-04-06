"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip
);

export default function Chart() {
  const data = {
    labels: [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ],
    datasets: [
      {
        data: [
          2100, 3100, 2400, 2800,
          4100, 3500, 3200, 2000,
          4500, 4700, 2600, 3500
        ],
        fill: true,
        backgroundColor: "rgba(194,255,216,0.8)", // area color
        borderColor: "#6EE7B7",                  // line color
        tension: 0.4,                            // smooth curve
        pointRadius: 4,                           // remove dots
        pointBackgroundColor: "#6EE7B7"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ctx.raw.toLocaleString()
        }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        min: 2000,
        max: 5000,
        grid: { display: false },
        ticks: { display: true } // hide Y labels (like your design)
      }
    }
  };

  return <Line data={data} options={options} />;
}