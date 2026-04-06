/**
 * Chart API helpers - mirrors PHP helper.php logic for Dion Global chart API.
 * API: https://content.dionglobal.in/lupinworldnew/JSON/chartapi.aspx?exchange=bse&
 */

const API_END_POINT = 'https://content.dionglobal.in/lupinworldnew/JSON/chartapi.aspx?exchange=bse&';
const PRICE_TYPE = { month: 'M', week: 'W', day: 'D' };
const DAILY_VOLUME_MAX_YEARS = 5;

/**
 * Format date as Y-m-d for volume API
 */
function formatDateYMD(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

/**
 * Fetch volume data from Dion Global API
 * @param {string} startDate - Y-m-d
 * @param {string} endDate - Y-m-d
 * @param {'day'|'week'|'month'} priceType
 * @returns {Promise<Array>} raw API response array
 */
export async function getVolumeData(startDate, endDate, priceType = 'day') {
  const start = formatDateYMD(startDate);
  const end = formatDateYMD(endDate);
  const type = PRICE_TYPE[priceType] || PRICE_TYPE.day;
  const url = `${API_END_POINT}startDate=${start}&endDate=${end}&priceType=${type}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Chart API error: ${res.status}`);
  const json = await res.json();
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.Table)) return json.Table;
  return Array.isArray(json) ? json : [];
}

/**
 * Parse numeric string from API (handles Indian format with commas, e.g. "1,971.50")
 */
function parseNum(value) {
  if (value == null || value === '') return NaN;
  const str = String(value).trim().replace(/,/g, '');
  const n = parseFloat(str);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Parse date string from API (handles dd-mm-yyyy, yyyy-mm-d, d/m/Y, etc.)
 * Uses noon UTC so the calendar day is the same in all timezones (avoids
 * midnight UTC showing as previous/next day in PST/IST and wrong tooltip).
 */
function parseDate(value) {
  if (value == null) return NaN;
  const str = String(value).trim();
  const parts = str.split(/[/-]/);
  if (parts.length !== 3) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? NaN : d.getTime();
  }
  let year, month, day;
  if (parts[0].length === 4) {
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  } else {
    year = parseInt(parts[2], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[0], 10);
  }
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return NaN;
  if (month < 0 || month > 11 || day < 1 || day > 31) return NaN;
  return Date.UTC(year, month, day, 12, 0, 0, 0);
}

/**
 * Parse raw volume API response into chart-ready format (matches PHP get_full_volumn_data)
 * Ensures chronological order (oldest first) for a continuous chart line.
 */
export function parseVolumeResponse(rawData, priceType = 'day') {
  let arr = rawData;
  if (!Array.isArray(arr)) {
    if (arr && typeof arr === 'object' && Array.isArray(arr.data)) arr = arr.data;
    else if (arr && typeof arr === 'object' && Array.isArray(arr.Table)) arr = arr.Table;
    else return { volume: [], dividend: [], earning: [] };
  }
  if (arr.length === 0) return { volume: [], dividend: [], earning: [] };

  const volumeDataParsed = [];
  const dividendData = [];
  const earningData = [];

  for (const row of arr) {
    const timestamp = parseDate(row.Date);
    if (Number.isNaN(timestamp)) continue;

    const closePrice = parseNum(row['Close Price'] ?? row['ClosePrice'] ?? row['Close']) || 0;
    const tradeQty = parseNum(row['Traded Quantity (Nos.)'] ?? row['TradedQuantity']) || 0;

    volumeDataParsed.push({
      timestamp,
      date: row.Date,
      volumn: row['Traded Value (Lacs.)'] ?? row['TradedValue'] ?? '',
      tooltip_label: `Closing Price: ${closePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR`,
      tooltip_body: `Traded Quantity ${(parseNum(row['Traded Quantity (Nos.)']) || 0).toLocaleString('en-IN')}`,
      trade_nos: row['No. Of Trades (Nos.)'] ?? '',
      trade_qty: tradeQty,
      close_price: closePrice,
    });

    if (priceType === 'day') {
      if (row['Dividend Per Share (in Rs)'] ?? row['DividendPerShare']) {
        dividendData.push({
          timestamp,
          dividend_amount: row['Dividend Per Share (in Rs)'] ?? row['DividendPerShare'],
          dividend_per: row['Dividend (in %)'] ?? row['DividendPercent'],
          tooltip_label: `Dividend (in INR): ${row['Dividend Per Share (in Rs)'] ?? row['DividendPerShare']}`,
          tooltip_body: `Dividend (%): ${row['Dividend (in %)'] ?? row['DividendPercent'] ?? ''}`,
        });
      }
      if (row['Consolidated EPS (in cr)'] ?? row['ConsolidatedEPS']) {
        earningData.push({
          timestamp,
          earning_amount: row['Consolidated EPS (in cr)'] ?? row['ConsolidatedEPS'],
          tooltip_label: `Earnings per share (in INR): ${row['Consolidated EPS (in cr)'] ?? row['ConsolidatedEPS']}`,
        });
      }
    }
  }

  volumeDataParsed.sort((a, b) => a.timestamp - b.timestamp);
  dividendData.sort((a, b) => a.timestamp - b.timestamp);
  earningData.sort((a, b) => a.timestamp - b.timestamp);

  return { volume: volumeDataParsed, dividend: dividendData, earning: earningData };
}

/**
 * Fetch full chart data (day, week, month) and return structure matching PHP $chart_data
 */
export async function getFullChartData() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - DAILY_VOLUME_MAX_YEARS);
  const start = formatDateYMD(startDate);
  const end = formatDateYMD(endDate);

  const [rawDay, rawWeek, rawMonth] = await Promise.all([
    getVolumeData(start, end, 'day'),
    getVolumeData(start, end, 'week'),
    getVolumeData(start, end, 'month'),
  ]);

  const { volume: volumeDay, dividend, earning } = parseVolumeResponse(rawDay, 'day');
  const { volume: volumeWeek } = parseVolumeResponse(rawWeek, 'week');
  const { volume: volumeMonth } = parseVolumeResponse(rawMonth, 'month');

  return {
    volume_day: volumeDay,
    volume_day_timestamp: volumeDay.map((d) => d.timestamp),
    volume_week: volumeWeek,
    volume_week_timestamp: volumeWeek.map((d) => d.timestamp),
    volume_month: volumeMonth,
    volume_month_timestamp: volumeMonth.map((d) => d.timestamp),
    dividend: dividend || [],
    dividend_timestamp: (dividend || []).map((d) => d.timestamp),
    earning: earning || [],
    earning_timestamp: (earning || []).map((d) => d.timestamp),
  };
}
