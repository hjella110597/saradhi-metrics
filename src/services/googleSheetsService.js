import {
  GOOGLE_SHEETS_CONFIG,
  TRADE_JOURNAL_COLUMNS,
  DAY_SUMMARY_COLUMNS,
  DAY_PERFORMANCE_COLUMNS,
} from "../config/googleSheets";

export async function fetchTradeJournal() {
  const { API_KEY, SHEET_ID, TRADE_JOURNAL } = GOOGLE_SHEETS_CONFIG;
  const { SHEET_NAME, RANGE } = TRADE_JOURNAL;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return parseTradeJournalData(data.values);
  } catch (error) {
    console.error("Error fetching Trade Journal data:", error);
    throw error;
  }
}

export async function fetchDaySummary() {
  const { API_KEY, SHEET_ID, DAY_SUMMARY } = GOOGLE_SHEETS_CONFIG;
  const { SHEET_NAME, RANGE } = DAY_SUMMARY;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return parseDaySummaryData(data.values);
  } catch (error) {
    console.error("Error fetching Day Summary data:", error);
    throw error;
  }
}

export async function fetchDayPerformance() {
  const { API_KEY, SHEET_ID, DAY_PERFORMANCE } = GOOGLE_SHEETS_CONFIG;
  const { SHEET_NAME, RANGE } = DAY_PERFORMANCE;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return parseDayPerformanceData(data.values);
  } catch (error) {
    console.error("Error fetching Day Performance data:", error);
    throw error;
  }
}

export async function fetchAllSheetData() {
  try {
    const [trades, daySummary, dayPerformance] = await Promise.all([
      fetchTradeJournal(),
      fetchDaySummary(),
      fetchDayPerformance(),
    ]);

    return { trades, daySummary, dayPerformance };
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    throw error;
  }
}

function parseTradeJournalData(rows) {
  if (!rows || rows.length < 2) {
    return [];
  }

  const COL = TRADE_JOURNAL_COLUMNS;
  const dataRows = rows.slice(1); // Skip header row

  return dataRows.map((row, index) => {
    const buyPrice = parseFloat(row[COL.BUY_PRICE]) || 0;
    const sellPrice = parseFloat(row[COL.SELL_PRICE]) || 0;
    const quantity = parseInt(row[COL.QUANTITY]) || 1;

    const profitLoss = (sellPrice - buyPrice) * quantity * 100;

    return {
      id: row[COL.TRANSACTION_ID] || `trade-${index}`,
      timestamp: row[COL.TIMESTAMP] || "",
      ticker: row[COL.TICKER] || "",
      optionType: row[COL.OPTION_TYPE] || "",
      strike: parseFloat(row[COL.STRIKE]) || 0,
      expirationDate: row[COL.EXPIRATION_DATE] || "",
      quantity: quantity,
      buyPrice: buyPrice,
      sellPrice: sellPrice,
      buyTime: row[COL.BUY_TIME] || "",
      sellTime: row[COL.SELL_TIME] || "",
      profitPercent: parseFloat(row[COL.PROFIT_PERCENT]) || 0,
      profitLoss: profitLoss,
      tradeThesis: row[COL.TRADE_THESIS] || "",
      rollup: row[COL.ROLLUP] || "",
      marketConditions: row[COL.MARKET_CONDITIONS] || "",
      trendAlignment: row[COL.TREND_ALIGNMENT] || "",
      setup: row[COL.SETUP] || "",
      entry: row[COL.ENTRY] || "",
      exit: row[COL.EXIT] || "",
      riskSizing: row[COL.RISK_SIZING] || "",
      bypassedSaradhi: row[COL.BYPASSED_SARADHI] || "",
      bypassedArea: row[COL.BYPASSED_AREA] || "",
      areasToImprove: row[COL.AREAS_TO_IMPROVE] || "",
      chartScreenshot: row[COL.CHART_SCREENSHOT] || "",
      isWin: profitLoss > 0,
    };
  });
}

/**
 * Parses raw Day Summary sheet data into structured day objects
 */
function parseDaySummaryData(rows) {
  if (!rows || rows.length < 2) {
    return [];
  }

  const COL = DAY_SUMMARY_COLUMNS;
  const dataRows = rows.slice(1);

  return dataRows.map((row, index) => {
    const startBalance = parseFloat(row[COL.START_BALANCE]) || 0;
    const endBalance = parseFloat(row[COL.END_BALANCE]) || 0;
    const profitLoss = parseFloat(row[COL.PROFIT_LOSS]) || 0;
    const profitLossPercent = parseFloat(row[COL.PROFIT_LOSS_PERCENT]) || 0;

    return {
      id: `day-${index}`,
      date: row[COL.DATE] || "",
      startBalance,
      endBalance,
      profitLoss,
      profitLossPercent,
      totalTrades: parseInt(row[COL.TOTAL_TRADES]) || 0,
      winningTrades: parseInt(row[COL.WINNING_TRADES]) || 0,
      losingTrades: parseInt(row[COL.LOSING_TRADES]) || 0,
      openPositions: parseInt(row[COL.OPEN_POSITIONS]) || 0,
      winRate: parseFloat(row[COL.WIN_RATE]) || 0,
      avgProfitPercent: parseFloat(row[COL.AVG_PROFIT_PERCENT]) || 0,
      isWinningDay: profitLoss > 0,
    };
  });
}

/**
 * Parses raw Day Performance sheet data into structured performance objects
 */
function parseDayPerformanceData(rows) {
  if (!rows || rows.length < 2) {
    return [];
  }

  const COL = DAY_PERFORMANCE_COLUMNS;
  const dataRows = rows.slice(1); // Skip header row

  return dataRows.map((row, index) => {
    const premarketRoutine = parseInt(row[COL.PREMARKET_ROUTINE]) || 0;
    const structure = parseInt(row[COL.STRUCTURE]) || 0;
    const focusList = parseInt(row[COL.FOCUS_LIST]) || 0;
    const entry = parseInt(row[COL.ENTRY]) || 0;
    const management = parseInt(row[COL.MANAGEMENT]) || 0;
    const psychology = parseInt(row[COL.PSYCHOLOGY]) || 0;

    // Calculate average if not provided
    const average = row[COL.AVERAGE]
      ? parseInt(row[COL.AVERAGE])
      : Math.round(
          (premarketRoutine +
            structure +
            focusList +
            entry +
            management +
            psychology) /
            6
        );

    return {
      id: `perf-${index}`,
      date: row[COL.DATE] || "",
      premarketRoutine,
      structure,
      focusList,
      entry,
      management,
      psychology,
      average,
      ratings: {
        premarket: premarketRoutine,
        structure: structure,
        focusList: focusList,
        entry: entry,
        management: management,
        psychology: psychology,
      },
    };
  });
}
