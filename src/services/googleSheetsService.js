import { GOOGLE_SHEETS_CONFIG, COLUMN_MAPPING } from "../config/googleSheets";

/**
 * Fetches data from Google Sheets API
 */
export async function fetchSheetData() {
  const { API_KEY, SHEET_ID, SHEET_NAME, RANGE } = GOOGLE_SHEETS_CONFIG;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return parseSheetData(data.values);
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    throw error;
  }
}

/**
 * Parses raw sheet data into structured trade objects
 */
function parseSheetData(rows) {
  if (!rows || rows.length < 2) {
    return [];
  }

  // Skip header row
  const dataRows = rows.slice(1);

  return dataRows.map((row, index) => {
    const buyPrice = parseFloat(row[COLUMN_MAPPING.BUY_PRICE]) || 0;
    const sellPrice = parseFloat(row[COLUMN_MAPPING.SELL_PRICE]) || 0;
    const quantity = parseInt(row[COLUMN_MAPPING.QUANTITY]) || 1;
    const profitLoss = (sellPrice - buyPrice) * quantity * 100; // Options are typically 100 shares

    return {
      id: row[COLUMN_MAPPING.TRANSACTION_ID] || `trade-${index}`,
      timestamp: row[COLUMN_MAPPING.TIMESTAMP] || "",
      ticker: row[COLUMN_MAPPING.TICKER] || "",
      optionType: row[COLUMN_MAPPING.OPTION_TYPE] || "",
      strike: parseFloat(row[COLUMN_MAPPING.STRIKE]) || 0,
      expirationDate: row[COLUMN_MAPPING.EXPIRATION_DATE] || "",
      quantity: quantity,
      buyPrice: buyPrice,
      sellPrice: sellPrice,
      buyTime: row[COLUMN_MAPPING.BUY_TIME] || "",
      sellTime: row[COLUMN_MAPPING.SELL_TIME] || "",
      profitPercent: parseFloat(row[COLUMN_MAPPING.PROFIT_PERCENT]) || 0,
      profitLoss: profitLoss,
      tradeThesis: row[COLUMN_MAPPING.TRADE_THESIS] || "",
      rollup: row[COLUMN_MAPPING.ROLLUP] || "",
      marketConditions: row[COLUMN_MAPPING.MARKET_CONDITIONS] || "",
      trendAlignment: row[COLUMN_MAPPING.TREND_ALIGNMENT] || "",
      setup: row[COLUMN_MAPPING.SETUP] || "",
      entry: row[COLUMN_MAPPING.ENTRY] || "",
      exit: row[COLUMN_MAPPING.EXIT] || "",
      riskSizing: row[COLUMN_MAPPING.RISK_SIZING] || "",
      bypassedSaradhi: row[COLUMN_MAPPING.BYPASSED_SARADHI] || "",
      bypassedArea: row[COLUMN_MAPPING.BYPASSED_AREA] || "",
      areasToImprove: row[COLUMN_MAPPING.AREAS_TO_IMPROVE] || "",
      chartScreenshot: row[COLUMN_MAPPING.CHART_SCREENSHOT] || "",
      isWin: profitLoss > 0,
    };
  });
}

/**
 * Generates mock data for development/demo purposes
 */
export function generateMockData() {
  const tickers = [
    "AAPL",
    "TSLA",
    "NVDA",
    "AMZN",
    "MSFT",
    "META",
    "GOOGL",
    "SPY",
    "QQQ",
    "AMD",
  ];
  const optionTypes = ["Call", "Put"];
  const setups = [
    "Breakout",
    "Pullback",
    "Momentum",
    "Reversal",
    "Trend Continuation",
  ];
  const marketConditions = ["Bullish", "Bearish", "Neutral", "Volatile"];
  const trendAlignments = ["Aligned", "Counter-Trend", "Neutral"];

  const trades = [];
  const startDate = new Date("2025-01-01");
  const endDate = new Date("2025-12-11");

  let currentDate = new Date(startDate);
  let tradeId = 1000;

  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Generate 1-5 trades per day
      const tradesPerDay = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < tradesPerDay; i++) {
        const ticker = tickers[Math.floor(Math.random() * tickers.length)];
        const optionType =
          optionTypes[Math.floor(Math.random() * optionTypes.length)];
        const strike = Math.floor(Math.random() * 100) + 100;
        const buyPrice = Math.random() * 5 + 0.5;
        const profitPercent = (Math.random() - 0.4) * 100; // Slightly negative bias
        const sellPrice = buyPrice * (1 + profitPercent / 100);
        const quantity = Math.floor(Math.random() * 5) + 1;
        const profitLoss = (sellPrice - buyPrice) * quantity * 100;

        const buyHour = Math.floor(Math.random() * 6) + 9;
        const buyMinute = Math.floor(Math.random() * 60);
        const sellHour = Math.min(
          buyHour + Math.floor(Math.random() * 3) + 1,
          16
        );
        const sellMinute = Math.floor(Math.random() * 60);

        const expDate = new Date(currentDate);
        expDate.setDate(expDate.getDate() + Math.floor(Math.random() * 30) + 1);

        trades.push({
          id: `TXN-${tradeId++}`,
          timestamp: currentDate.toISOString().split("T")[0],
          ticker,
          optionType,
          strike,
          expirationDate: expDate.toISOString().split("T")[0],
          quantity,
          buyPrice: parseFloat(buyPrice.toFixed(2)),
          sellPrice: parseFloat(sellPrice.toFixed(2)),
          buyTime: `${buyHour.toString().padStart(2, "0")}:${buyMinute.toString().padStart(2, "0")}`,
          sellTime: `${sellHour.toString().padStart(2, "0")}:${sellMinute.toString().padStart(2, "0")}`,
          profitPercent: parseFloat(profitPercent.toFixed(2)),
          profitLoss: parseFloat(profitLoss.toFixed(2)),
          tradeThesis: "Technical breakout with volume confirmation",
          rollup: "",
          marketConditions:
            marketConditions[
              Math.floor(Math.random() * marketConditions.length)
            ],
          trendAlignment:
            trendAlignments[Math.floor(Math.random() * trendAlignments.length)],
          setup: setups[Math.floor(Math.random() * setups.length)],
          entry: "Good",
          exit: profitLoss > 0 ? "Good" : "Early",
          riskSizing: "Appropriate",
          bypassedSaradhi: Math.random() > 0.8 ? "Yes" : "No",
          bypassedArea: "",
          areasToImprove: profitLoss < 0 ? "Patience, Stop Loss" : "",
          chartScreenshot: "",
          isWin: profitLoss > 0,
        });
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return trades;
}
