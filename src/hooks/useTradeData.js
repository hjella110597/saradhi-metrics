import { useState, useEffect, useMemo } from "react";
import {
  fetchSheetData,
  generateMockData,
} from "../services/googleSheetsService";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  subDays,
  isWithinInterval,
  parseISO,
} from "date-fns";

export function useTradeData() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastImport, setLastImport] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date("2025-01-01"),
    end: new Date("2025-12-11"),
  });
  const [useMockData, setUseMockData] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMockData) {
        const mockData = generateMockData();
        setTrades(mockData);
        setLastImport(new Date());
      } else {
        const data = await fetchSheetData();
        setTrades(data);
        setLastImport(new Date());
      }
    } catch (err) {
      setError(err.message);
      // Fall back to mock data on error
      const mockData = generateMockData();
      setTrades(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (useMockData) {
          const mockData = generateMockData();
          setTrades(mockData);
          setLastImport(new Date());
        } else {
          const data = await fetchSheetData();
          setTrades(data);
          setLastImport(new Date());
        }
      } catch (err) {
        setError(err.message);
        const mockData = generateMockData();
        setTrades(mockData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [useMockData]);

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const tradeDate = parseISO(trade.timestamp);
      return isWithinInterval(tradeDate, {
        start: dateRange.start,
        end: dateRange.end,
      });
    });
  }, [trades, dateRange]);

  const metrics = useMemo(() => {
    if (filteredTrades.length === 0) {
      return {
        netPnL: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        tradeWinPercent: 0,
        profitFactor: 0,
        dayWinPercent: 0,
        avgWin: 0,
        avgLoss: 0,
        avgWinLossRatio: 0,
        maxDrawdown: 0,
        largestWin: 0,
        largestLoss: 0,
        avgTradeTime: 0,
      };
    }

    const wins = filteredTrades.filter((t) => t.profitLoss > 0);
    const losses = filteredTrades.filter((t) => t.profitLoss < 0);

    const totalProfit = wins.reduce((sum, t) => sum + t.profitLoss, 0);
    const totalLoss = Math.abs(
      losses.reduce((sum, t) => sum + t.profitLoss, 0)
    );

    const netPnL = filteredTrades.reduce((sum, t) => sum + t.profitLoss, 0);

    // Calculate daily P&L for day win %
    const dailyPnL = {};
    filteredTrades.forEach((trade) => {
      const day = trade.timestamp;
      dailyPnL[day] = (dailyPnL[day] || 0) + trade.profitLoss;
    });

    const tradingDays = Object.keys(dailyPnL);
    const winningDays = tradingDays.filter((day) => dailyPnL[day] > 0);

    const avgWin = wins.length > 0 ? totalProfit / wins.length : 0;
    const avgLoss = losses.length > 0 ? totalLoss / losses.length : 0;

    // Calculate max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let cumulative = 0;

    filteredTrades.forEach((trade) => {
      cumulative += trade.profitLoss;
      if (cumulative > peak) peak = cumulative;
      const drawdown = peak - cumulative;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    return {
      netPnL,
      totalTrades: filteredTrades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      tradeWinPercent: (wins.length / filteredTrades.length) * 100,
      profitFactor:
        totalLoss > 0
          ? totalProfit / totalLoss
          : totalProfit > 0
            ? Infinity
            : 0,
      dayWinPercent:
        tradingDays.length > 0
          ? (winningDays.length / tradingDays.length) * 100
          : 0,
      avgWin,
      avgLoss,
      avgWinLossRatio: avgLoss > 0 ? avgWin / avgLoss : 0,
      maxDrawdown,
      largestWin:
        wins.length > 0 ? Math.max(...wins.map((t) => t.profitLoss)) : 0,
      largestLoss:
        losses.length > 0 ? Math.min(...losses.map((t) => t.profitLoss)) : 0,
      totalProfit,
      totalLoss,
      winningDays: winningDays.length,
      totalDays: tradingDays.length,
      dailyPnL,
    };
  }, [filteredTrades]);

  const setPresetDateRange = (preset) => {
    const today = new Date("2025-12-11");

    switch (preset) {
      case "today":
        setDateRange({ start: startOfDay(today), end: endOfDay(today) });
        break;
      case "thisWeek":
        setDateRange({ start: startOfWeek(today), end: endOfWeek(today) });
        break;
      case "thisMonth":
        setDateRange({ start: startOfMonth(today), end: endOfMonth(today) });
        break;
      case "last30":
        setDateRange({ start: subDays(today, 30), end: today });
        break;
      case "lastMonth": {
        const lastMonth = subDays(startOfMonth(today), 1);
        setDateRange({
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        });
        break;
      }
      case "thisQuarter":
        setDateRange({
          start: startOfQuarter(today),
          end: endOfQuarter(today),
        });
        break;
      case "ytd":
        setDateRange({ start: startOfYear(today), end: today });
        break;
      default:
        break;
    }
  };

  return {
    trades: filteredTrades,
    allTrades: trades,
    loading,
    error,
    lastImport,
    metrics,
    dateRange,
    setDateRange,
    setPresetDateRange,
    refetch: fetchData,
    useMockData,
    setUseMockData,
  };
}
