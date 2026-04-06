'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TimeScale,
  Tooltip,
  Filler,
  ScatterController,
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { Line, Bar } from 'react-chartjs-2';
import { DateTime } from 'luxon';
import NavigationLinks from '../NavigationLinks';
import '../../scss/components/InteractiveChart.scss';

const pointLabelPlugin = {
  id: 'pointLabel',
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    if (!ctx) return;
    ctx.save();
    chart.data.datasets.forEach((dataset, i) => {
      const pointLabel = dataset.pointLabel;
      if (pointLabel == null || pointLabel === '') return;
      const meta = chart.getDatasetMeta(i);
      if (!meta?.data?.length) return;
      meta.data.forEach((point) => {
        const { x, y } = point;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#2B357D';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pointLabel, x, y);
      });
    });
    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ScatterController,
  TimeScale,
  Tooltip,
  Filler,
  pointLabelPlugin
);

const TIME_FILTERS = [
  { label: '5 Days', num: 5, type: 'day' },
  { label: '1 Month', num: 1, type: 'month' },
  { label: '3 Months', num: 3, type: 'month' },
  { label: '6 Months', num: 6, type: 'month' },
  { label: '1 Year', num: 1, type: 'year' },
  { label: '5 Years', num: 5, type: 'year' },
];

const TIME_FILTER_OPTIONS = [
  { value: '', label: 'Select filter' },
  { value: '5', label: '5 Days' },
  { value: '30', label: '1 Month' },
  { value: '90', label: '3 Months' },
  { value: '180', label: '6 Months' },
  { value: '366', label: '1 Year' },
  { value: '1825', label: '5 Years' },
];

function getNearestElement(arr, goal) {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
  );
}

function getDateTypeKeyword(type) {
  const map = { month: 'months', day: 'days', year: 'years' };
  return map[type] || map.month;
}

function hasNonZeroValue(val) {
  if (val == null || val === '') return false;
  const n = parseFloat(String(val).replace(/,/g, ''));
  return Number.isFinite(n) && n !== 0;
}

function createDividendData(dailyDividend, dailyData, dailyDataTimestamp) {
  if (!dailyDividend?.length || !dailyData?.length) return [];
  return dailyDividend.map((el) => {
    const nearest = getNearestElement(dailyDataTimestamp, el.timestamp);
    const idx = dailyDataTimestamp.indexOf(nearest);
    const yValue = (dailyData[idx]?.close_price ?? 0) + 50;
    return { ...el, yValue };
  });
}

function getBarchartBg(data) {
  if (!data?.length) return [];
  let lastVal = 0;
  return data.map((el) => {
    const qty = parseFloat(el.trade_qty);
    const isGreen = qty >= lastVal;
    lastVal = qty;
    return isGreen ? 'rgba(8, 163, 63, 0.8)' : 'rgba(220, 53, 69, 0.8)';
  });
}

function formatTooltipTitle(context, timeUnit) {
  if (!context?.length || !context[0]?.raw?.timestamp) return '';
  const date = DateTime.fromMillis(context[0].raw.timestamp);
  if (timeUnit === 'month') return date.toFormat('LLL yyyy');
  if (timeUnit === 'week') return `Week ending on ${date.toFormat('dd LLL yyyy')}`;
  return date.toFormat('dd LLL yyyy');
}

export default function InteractiveChart({ showNavigationLinks = true }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [timeFilterSelect, setTimeFilterSelect] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDividend, setShowDividend] = useState(false);
  const [showEarning, setShowEarning] = useState(false);
  const [xMin, setXMin] = useState(null);
  const [xMax, setXMax] = useState(null);
  const [timeUnit, setTimeUnit] = useState('day');
  const [visibleDataset, setVisibleDataset] = useState(0); // 0=day, 1=week, 2=month
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  const todayDateObj = useMemo(() => DateTime.local(), []);
  const defaultXMin = useMemo(() => todayDateObj.minus({ months: 3 }).toMillis(), [todayDateObj]);
  const defaultXMax = useMemo(() => todayDateObj.toMillis(), [todayDateObj]);
  const minDateStr = useMemo(() => todayDateObj.minus({ years: 5 }).toISODate(), [todayDateObj]);
  const maxDateStr = useMemo(() => todayDateObj.toISODate(), [todayDateObj]);

  useEffect(() => {
    fetch('/api/chart-data', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch chart data');
        return res.json();
      })
      .then((data) => {
        setChartData(data);
        setXMin(defaultXMin);
        setXMax(defaultXMax);
        setTimeUnit('day');
        setVisibleDataset(0);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load chart data');
      })
      .finally(() => setLoading(false));
  }, [defaultXMin, defaultXMax]);

  const {
    lineDatasets,
    barDatasets,
    dailyData,
    dailyDataTimestamp,
  } = useMemo(() => {
    if (!chartData?.volume_day?.length) return { lineDatasets: [], barDatasets: [], dailyData: [], dailyDataTimestamp: [] };

    const daily = chartData.volume_day;
    const dailyTs = chartData.volume_day_timestamp || daily.map((d) => d.timestamp);
    const week = chartData.volume_week || [];
    const month = chartData.volume_month || [];
    const chartDividendData = createDividendData(chartData.dividend, daily, dailyTs);
    const chartEarningData = createDividendData(chartData.earning, daily, dailyTs);

    const activeLineData = visibleDataset === 0 ? daily : visibleDataset === 1 ? week : month;
    const activeBarData = visibleDataset === 0 ? daily : visibleDataset === 1 ? week : month;

    const lineFill = 'rgba(204, 204, 204, 0.3)';
    const lineColor = 'rgb(0, 174, 77)';

    const activeLineDataset = {
      type: 'line',
      label: 'Close Price',
      data: activeLineData,
      fill: true,
      backgroundColor: lineFill,
      borderColor: lineColor,
      borderWidth: 2,
      parsing: { yAxisKey: 'close_price', xAxisKey: 'timestamp' },
      pointRadius: 3,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: lineColor,
      pointBorderWidth: 2,
      pointHitRadius: 10,
      pointHoverRadius: 6,
      tension: 0.1,
      spanGaps: true,
    };

    const dividendWithValue = chartDividendData.filter(
      (p) => hasNonZeroValue(p.dividend_amount) || hasNonZeroValue(p.dividend_per)
    );
    const earningWithValue = chartEarningData.filter((p) => hasNonZeroValue(p.earning_amount));

    const lineSets = [activeLineDataset];
    if (showDividend && dividendWithValue.length > 0) {
      lineSets.push({
        type: 'scatter',
        label: 'Dividend',
        pointLabel: 'D',
        data: dividendWithValue,
        pointStyle: 'circle',
        pointRadius: 10,
        pointHoverRadius: 12,
        pointHitRadius: 12,
        pointBackgroundColor: 'rgba(255, 255, 255, 0.95)',
        pointBorderColor: '#2B357D',
        pointBorderWidth: 1.5,
        parsing: { yAxisKey: 'yValue', xAxisKey: 'timestamp' },
      });
    }
    if (showEarning && earningWithValue.length > 0) {
      lineSets.push({
        type: 'scatter',
        label: 'Earning',
        pointLabel: 'E',
        data: earningWithValue,
        pointStyle: 'circle',
        pointRadius: 10,
        pointHoverRadius: 12,
        pointHitRadius: 12,
        pointBackgroundColor: 'rgba(255, 255, 255, 0.95)',
        pointBorderColor: '#00AE4D',
        pointBorderWidth: 1.5,
        parsing: { yAxisKey: 'yValue', xAxisKey: 'timestamp' },
      });
    }

    const barSets = [
      {
        type: 'bar',
        label: 'Trade Volume',
        data: activeBarData,
        backgroundColor: getBarchartBg(activeBarData),
        parsing: { yAxisKey: 'trade_qty', xAxisKey: 'timestamp' },
        barPercentage: 0.8,
        categoryPercentage: 1,
      },
    ];

    return {
      lineDatasets: lineSets,
      barDatasets: barSets,
      dailyData: daily,
      dailyDataTimestamp: dailyTs,
    };
  }, [chartData, visibleDataset, showDividend, showEarning]);

  const updateChartDateUnit = (min, max) => {
    const maxObj = max ? DateTime.fromMillis(max) : todayDateObj;
    const minObj = min ? DateTime.fromMillis(min) : todayDateObj.minus({ years: 5 });
    const diff = maxObj.diff(minObj, 'days').toObject().days || 0;

    if (diff > 365) {
      setTimeUnit('month');
      setVisibleDataset(2);
    } else if (diff > 183) {
      setTimeUnit('week');
      setVisibleDataset(1);
    } else {
      setTimeUnit('day');
      setVisibleDataset(0);
    }
  };

  const setDailyData = (num, type, filterId = null) => {
    setStartDate('');
    setEndDate('');
    if (filterId != null) setActiveFilter(String(filterId));
    setTimeFilterSelect('');

    const obj = {};
    obj[getDateTypeKeyword(type)] = num;
    const timestamp = todayDateObj.minus(obj).toMillis();

    setXMin(timestamp);
    setXMax(todayDateObj.toMillis());
    updateChartDateUnit(timestamp, todayDateObj.toMillis());
  };

  const handleStartEndDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setActiveFilter(null);
    setTimeFilterSelect('');

    const startMs = start ? DateTime.fromISO(start).toMillis() : defaultXMin;
    const endMs = end ? DateTime.fromISO(end).toMillis() : defaultXMax;
    setXMin(startMs);
    setXMax(endMs);
    const diff = (endMs - startMs) / (1000 * 60 * 60 * 24);
    if (diff > 365) {
      setTimeUnit('month');
      setVisibleDataset(2);
    } else if (diff > 183) {
      setTimeUnit('week');
      setVisibleDataset(1);
    } else {
      setTimeUnit('day');
      setVisibleDataset(0);
    }
  };

  const handleTimeFilterSelect = (val) => {
    setTimeFilterSelect(val);
    if (!val) return;
    const n = parseInt(val, 10);
    if (n <= 31) setDailyData(n, 'day');
    else if (n <= 95) setDailyData(3, 'month');
    else if (n <= 185) setDailyData(6, 'month');
    else if (n <= 366) setDailyData(1, 'year');
    else setDailyData(5, 'year');
  };

  const gridColor = 'rgba(0, 0, 0, 0.08)';

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: true },
      scales: {
        x: {
          type: 'time',
          min: xMin ?? defaultXMin,
          max: xMax ?? defaultXMax,
          time: {
            unit: timeUnit,
            displayFormats: { day: 'dd LLL', week: 'dd LLL', month: 'LLL yy' },
            tooltipFormat: 'dd LLL yyyy',
          },
          ticks: { display: false },
          grid: { display: true, color: gridColor },
        },
        y: {
          title: { display: true, text: 'Closing Price' },
          ticks: { display: false },
          grid: { display: true, color: gridColor },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          intersect: true,
          backgroundColor: '#fff',
          titleColor: '#000',
          bodyColor: '#000',
          displayColors: false,
          borderColor: '#2B357D',
          borderWidth: 2,
          callbacks: {
            title: (context) => formatTooltipTitle(context, timeUnit),
            label: (context) => {
              const raw = context.raw;
              if (raw == null) return '';
              if (raw.dividend_amount !== undefined && raw.dividend_amount !== null && raw.dividend_amount !== '') {
                const pct = raw.dividend_per != null && raw.dividend_per !== '' ? ` (${raw.dividend_per}%)` : '';
                return `Dividend (in INR): Rs ${raw.dividend_amount}${pct}`;
              }
              if (raw.earning_amount !== undefined && raw.earning_amount !== null && raw.earning_amount !== '') {
                return `Earnings per share (in INR): ${raw.earning_amount}`;
              }
              return raw.tooltip_label ?? '';
            },
            afterBody: (context) => {
              const raw = context[0]?.raw;
              if (!raw) return '';
              if (raw.dividend_per != null && raw.dividend_per !== '' && raw.dividend_amount !== undefined) {
                return `Dividend (%): ${raw.dividend_per}`;
              }
              return raw.tooltip_body ?? '';
            },
          },
        },
      },
    }),
    [xMin, xMax, defaultXMin, defaultXMax, timeUnit]
  );

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: true },
      scales: {
        x: {
          type: 'time',
          min: xMin ?? defaultXMin,
          max: xMax ?? defaultXMax,
          time: {
            unit: timeUnit,
            displayFormats: { day: 'dd LLL', week: 'dd LLL', month: 'LLL yy' },
            tooltipFormat: 'dd LLL yyyy',
          },
          ticks: {
            display: true,
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 20,
          },
          grid: { display: true, color: gridColor },
        },
        y: {
          title: { display: true, text: 'Traded Qty' },
          ticks: { display: false },
          grid: { display: true, color: gridColor },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          intersect: true,
          backgroundColor: '#fff',
          titleColor: '#000',
          bodyColor: '#000',
          displayColors: false,
          borderColor: '#2B357D',
          borderWidth: 2,
          callbacks: {
            title: (context) => formatTooltipTitle(context, timeUnit),
            label: (context) => context.raw?.tooltip_label ?? '',
            afterBody: (context) => (context[0]?.raw?.tooltip_body ? context[0].raw.tooltip_body : ''),
          },
        },
      },
    }),
    [xMin, xMax, defaultXMin, defaultXMax, timeUnit]
  );

  if (loading) {
    return (
      <section className="interactive-chart">
        <div className="interactive-chart__container">
          {showNavigationLinks && <NavigationLinks />}
          <div className="interactive-chart__loading">Loading chart data…</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="interactive-chart">
        <div className="interactive-chart__container">
          {showNavigationLinks && <NavigationLinks />}
          <div className="interactive-chart__error">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="interactive-chart">
      {showNavigationLinks && (
        <div className="interactive-chart__container">
          <NavigationLinks />
        </div>
      )}

      <div className="interactive-chart__container">
        <div className="interactive-chart__controls">
          <div className="interactive-chart__filters">
            <div className="interactive-chart__time-btns interactive-chart__time-btns--desktop">
              {TIME_FILTERS.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  className={`interactive-chart__btn ${activeFilter === String(i) ? 'interactive-chart__btn--active' : ''}`}
                  onClick={() => setDailyData(f.num, f.type, i)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="interactive-chart__time-btns interactive-chart__time-btns--mobile">
              <label htmlFor="time-filter">Time filters</label>
              <select
                id="time-filter"
                className="interactive-chart__select"
                value={timeFilterSelect}
                onChange={(e) => handleTimeFilterSelect(e.target.value)}
              >
                {TIME_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="interactive-chart__checkboxes">
              <label className="interactive-chart__checkbox-label">
                <input
                  type="checkbox"
                  checked={showDividend}
                  onChange={(e) => setShowDividend(e.target.checked)}
                />
                <span>Show Dividends</span>
                <img src="/images/chart/dividend_icon.png" alt="" className="interactive-chart__icon" />
              </label>
              <label className="interactive-chart__checkbox-label">
                <input
                  type="checkbox"
                  checked={showEarning}
                  onChange={(e) => setShowEarning(e.target.checked)}
                />
                <span>Show Earnings</span>
                <img src="/images/chart/earnings.png" alt="" className="interactive-chart__icon" />
              </label>
            </div>
          </div>
          <div className="interactive-chart__dates">
            <div className="interactive-chart__date-group">
              <label htmlFor="start_date">Start date</label>
              <input
                type="date"
                id="start_date"
                className="interactive-chart__input"
                max={maxDateStr}
                min={minDateStr}
                value={startDate}
                onChange={(e) => handleStartEndDateChange(e.target.value, endDate)}
              />
            </div>
            <div className="interactive-chart__date-group">
              <label htmlFor="end_date">End date</label>
              <input
                type="date"
                id="end_date"
                className="interactive-chart__input"
                max={maxDateStr}
                min={startDate || minDateStr}
                value={endDate}
                onChange={(e) => handleStartEndDateChange(startDate, e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="interactive-chart__chart-wrap">
          <div className="interactive-chart__chart interactive-chart__chart--line">
            <Line ref={lineChartRef} data={{ datasets: lineDatasets }} options={lineOptions} />
          </div>
        </div>
        <div className="interactive-chart__chart-wrap">
          <div className="interactive-chart__chart interactive-chart__chart--bar">
            <Bar ref={barChartRef} data={{ datasets: barDatasets }} options={barOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
