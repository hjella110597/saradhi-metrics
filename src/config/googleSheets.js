export const GOOGLE_SHEETS_CONFIG = {
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_API_KEY_HERE",
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE",
  TRADE_JOURNAL: {
    SHEET_NAME: import.meta.env.VITE_TRADE_JOURNAL_SHEET || "Form Responses 1",
    RANGE: "A:X",
  },
  DAY_SUMMARY: {
    SHEET_NAME: import.meta.env.VITE_DAY_SUMMARY_SHEET || "Day Summary",
    RANGE: "A:O",
  },
  DAY_PERFORMANCE: {
    SHEET_NAME: import.meta.env.VITE_DAY_PERFORMANCE_SHEET || "Day Performance",
    RANGE: "A:H",
  },
};

// Column mapping for Trade Journal (Sheet 1)
export const TRADE_JOURNAL_COLUMNS = {
  TIMESTAMP: 0, // A - Date of trade
  TRANSACTION_ID: 1, // B - Unique transaction ID
  TICKER: 2, // C - Stock/ETF symbol
  OPTION_TYPE: 3, // D - Call or Put
  STRIKE: 4, // E - Strike price
  EXPIRATION_DATE: 5, // F - Option expiration date
  QUANTITY: 6, // G - Number of contracts
  BUY_PRICE: 7, // H - Entry price per contract
  SELL_PRICE: 8, // I - Exit price per contract
  BUY_TIME: 9, // J - Time of entry
  SELL_TIME: 10, // K - Time of exit
  PROFIT_PERCENT: 11, // L - Profit/Loss percentage
  TRADE_THESIS: 12, // M - Reason for taking the trade
  ROLLUP: 13, // N - Rollup indicator
  MARKET_CONDITIONS: 14, // O - Overall market conditions
  TREND_ALIGNMENT: 15, // P - Trade aligned with trend?
  SETUP: 16, // Q - Setup type (Breakout, Pullback, etc.)
  ENTRY: 17, // R - Entry quality rating
  EXIT: 18, // S - Exit quality rating
  RISK_SIZING: 19, // T - Position sizing assessment
  BYPASSED_SARADHI: 20, // U - Did you bypass your rules?
  BYPASSED_AREA: 21, // V - Which rule was bypassed?
  AREAS_TO_IMPROVE: 22, // W - Notes for improvement
  CHART_SCREENSHOT: 23, // X - Link to chart screenshot
};

// Column mapping for Day Summary (Sheet 2)
export const DAY_SUMMARY_COLUMNS = {
  DATE: 0, // A - Trading date
  START_BALANCE: 1, // B - Starting account balance
  END_BALANCE: 2, // C - Ending account balance
  PROFIT_LOSS: 3, // D - Profit/Loss in dollars
  PROFIT_LOSS_PERCENT: 4, // E - Profit/Loss percentage
  TOTAL_TRADES: 5, // F - Number of trades taken
  WINNING_TRADES: 6, // G - Number of winning trades
  LOSING_TRADES: 7, // H - Number of losing trades
  OPEN_POSITIONS: 8, // I - Number of open positions
  WIN_RATE: 9, // J - Win rate percentage
  AVG_PROFIT_PERCENT: 10, // K - Average profit percentage
};

// Column mapping for Day Performance (Sheet 3)
export const DAY_PERFORMANCE_COLUMNS = {
  DATE: 0, // A - Trading date
  PREMARKET_ROUTINE: 1, // B - Premarket Routine (1-5)
  STRUCTURE: 2, // C - Reading Market Structure (1-5)
  FOCUS_LIST: 3, // D - Planning Focus List (1-5)
  ENTRY: 4, // E - Trade Entry (1-5)
  MANAGEMENT: 5, // F - Trade Management (1-5)
  PSYCHOLOGY: 6, // G - Psychology (1-5)
  AVERAGE: 7, // H - Average score (1-5)
};
