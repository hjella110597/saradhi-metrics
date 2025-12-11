// Google Sheets Configuration
// Replace these values with your actual Google Sheets API credentials

export const GOOGLE_SHEETS_CONFIG = {
  // Your Google Sheets API Key (get from Google Cloud Console)
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_API_KEY_HERE",

  // Your Google Sheet ID (from the sheet URL)
  // Example: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE",

  // The name of the sheet/tab containing your data
  SHEET_NAME: import.meta.env.VITE_GOOGLE_SHEET_NAME || "Sheet1",

  // The range of data to fetch (e.g., 'A:X' for columns A through X)
  RANGE: "A:X",
};

// Column mapping based on your sheet structure
export const COLUMN_MAPPING = {
  TIMESTAMP: 0,
  TRANSACTION_ID: 1,
  TICKER: 2,
  OPTION_TYPE: 3,
  STRIKE: 4,
  EXPIRATION_DATE: 5,
  QUANTITY: 6,
  BUY_PRICE: 7,
  SELL_PRICE: 8,
  BUY_TIME: 9,
  SELL_TIME: 10,
  PROFIT_PERCENT: 11,
  TRADE_THESIS: 12,
  ROLLUP: 13,
  MARKET_CONDITIONS: 14,
  TREND_ALIGNMENT: 15,
  SETUP: 16,
  ENTRY: 17,
  EXIT: 18,
  RISK_SIZING: 19,
  BYPASSED_SARADHI: 20,
  BYPASSED_AREA: 21,
  AREAS_TO_IMPROVE: 22,
  CHART_SCREENSHOT: 23,
};
