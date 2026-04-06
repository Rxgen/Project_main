"use client";
import InnerBanner from "@/components/InnerBanner";
import React from "react";
import "@/scss/pages/investors-quarterly-results.scss";
import "@/scss/pages/investors-financial-info.scss";
import NavigationLinks from "@/components/NavigationLinks";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const BANNER_DATA = {
  title: { line1: "Financial", line2: "Reporting" },
  subheading: { enabled: false, text: "" },
  images: {
    banner: {
      url: "/assets/inner-banner/investors-quarterly-results-banner.png",
      alt: "Integrated Annual Report - Lupin",
    },
    bannerMobile: {
      url: "/assets/inner-banner/investors-quarterly-results-mobile-banner.png",
      alt: "Integrated Annual Report - Lupin",
    },
  },
};

const YEARS = ["FY21", "FY22", "FY23", "FY24", "FY25"];

const FALLBACK_CHART_DATA = [
  {
    title: "Net Sales",
    unit: "₹ Millions",
    labels: YEARS,
    values: [149270, 161928, 162700, 196563, 221921],
    dark: false,
  },
  {
    title: "EBITDA",
    unit: "₹ Millions",
    labels: YEARS,
    values: [27032, 23073, 18715, 39307, 54792],
    dark: false,
  },
  {
    title: "Net Profit",
    unit: "₹ Millions",
    labels: YEARS,
    values: [18000, 161928, 162700, 196563, 221921],
    dark: true,
  },
  {
    title: "Profit Before Tax",
    unit: "₹ Millions",
    labels: YEARS,
    values: [16751, 12135, 7165, 24223, 40150],
    dark: true,
  },
];

/**
 * Maps Strapi RevenueProfitabilitySection (same shape as mapFinancialData().revenueProfitability)
 * into rows for FinancialInfoChart.
 */
function mapRevenueProfitabilityToChartRows(data) {
  if (!data?.charts?.length) return [];

  return data.charts.map((chart, index) => {
    const rawTitle = chart.title || "";
    let title = rawTitle;
    let unit = "";
    const paren = rawTitle.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (paren) {
      title = paren[1].trim();
      unit = paren[2].trim();
    }

    const points = Array.isArray(chart.data) ? chart.data : [];
    const labels = points.map((p) => {
      if (!p?.label) return "";
      const parts = String(p.label).split(/\s*[–-]\s*/);
      return (parts[0] || p.label).trim();
    });
    const values = points.map((p) => Number(p.value) || 0);

    return {
      title,
      unit,
      labels,
      values,
      dark: index >= 2,
    };
  });
}

function FinancialInfoChart({ title, unit, values, labels, dark }) {
  const axisLabels = labels?.length ? labels : YEARS;

  const data = {
    labels: axisLabels,
    datasets: [
      {
        data: values,
        backgroundColor: "#25B05C",
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: dark ? 72 : 52,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: { display: false },
        border: {
          display: true,
          color: dark ? "#fff" : "#000",
        },
        ticks: {
          color: dark ? "#fff" : "#1a1a1a",
          font: { weight: 600 },
        },
      },
      y: {
        display: true,
        grace: "10%",
        grid: {
          display: false,
        },
        border: {
          display: true,
          color: dark ? "#fff" : "#000",
        },
        ticks: {
          color: dark ? "#fff" : "#1a1a1a",
          font: {
            size: 12,
            weight: "500",
          },
          callback: function (value) {
            return value.toLocaleString("en-IN");
          },
        },
      },
    },
  };

  const valueLabelPlugin = {
    id: "valueLabel",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      ctx.save();

      chart.getDatasetMeta(0).data.forEach((bar, index) => {
        const value = values[index].toLocaleString("en-IN");

        const x = bar.x;
        const y = bar.y - 12;

        const pillH = 28;
        const padding = 8;
        ctx.font = "600 12px Inter";
        const textWidth = ctx.measureText(value).width;

        ctx.fillStyle = "#1E8E4A";
        ctx.beginPath();
        ctx.roundRect(
          x - textWidth / 2 - padding,
          y - pillH,
          textWidth + padding * 2,
          pillH,
          6,
        );
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(value, x, y - pillH / 2);
      });

      ctx.restore();
    },
  };

  const axisColor = dark ? "#fff" : "#000";
  const axisArrowPlugin = {
    id: "financialInfoAxisArrows",
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea || chartArea.width <= 0 || chartArea.height <= 0) return;

      const { left, top, right, bottom } = chartArea;
      const tip = 6;
      const spread = 4;

      ctx.save();
      ctx.fillStyle = axisColor;

      // Y-axis: arrow at top of left spine, pointing up (−y)
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left - spread, top + tip);
      ctx.lineTo(left + spread, top + tip);
      ctx.closePath();
      ctx.fill();

      // X-axis: arrow at right end of bottom spine, pointing right (+x)
      ctx.beginPath();
      ctx.moveTo(right, bottom);
      ctx.lineTo(right - tip, bottom - spread);
      ctx.lineTo(right - tip, bottom + spread);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    },
  };

  return (
    <div
      className={`financial-info-chart ${
        dark ? "financial-info-chart--dark" : ""
      }`}
    >
      <div className="financial-info-chart__header">
        <h3 className="financial-info-chart__title">{title}</h3>
        {unit ? (
          <p className="financial-info-chart__unit">({unit})</p>
        ) : null}
      </div>

      <div className="financial-info-chart__plot">
        <Bar
          data={data}
          options={options}
          plugins={[valueLabelPlugin, axisArrowPlugin]}
        />
      </div>
    </div>
  );
}

export default function FinancialInfoPageClient({ revenueProfitabilityData }) {
  const fromCms = mapRevenueProfitabilityToChartRows(revenueProfitabilityData);
  const chartRows =
    fromCms.length > 0 ? fromCms : FALLBACK_CHART_DATA;

  return (
    <div className="quarterly-results quarterly-results--financial-info">
      <InnerBanner data={BANNER_DATA} />

      <section className="quarterly-results__content">
        <NavigationLinks
          links={[
            {
              id: "financial-info",
              label: "Financial Information",
              href: "/investors/financial-reporting/financial-info",
            },
            {
              id: "quarterly-results",
              label: "Quarterly Results",
              href: "/investors/financial-reporting/quarterly-results",
            },
            {
              id: "annual-report",
              label: "Integrated Annual Report",
              href: "/investors/financial-reporting/annual-report",
            },
            {
              id: "financial-statements-of-subsidiaries",
              label: "Financial Statement Of Subsidiaries",
              href: "/investors/financial-reporting/financial-statements-of-subsidiaries",
            },
          ]}
        />

        <div className="quarterly-results__bg">
          <h1 className="quarterly-results__header">Financial Information</h1>

          <div className="financial-info-charts financial-info-charts--top">
            {chartRows
              .map((chart, index) => ({ chart, index }))
              .filter(({ chart }) => !chart.dark)
              .map(({ chart, index }) => (
                <FinancialInfoChart key={index} {...chart} />
              ))}
          </div>

          <div className="financial-info-charts financial-info-charts--bottom">
            {chartRows
              .map((chart, index) => ({ chart, index }))
              .filter(({ chart }) => chart.dark)
              .map(({ chart, index }) => (
                <FinancialInfoChart key={index} {...chart} />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
