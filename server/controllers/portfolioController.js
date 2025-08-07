// File: src/controllers/portfolioController.js
const parseExcelFile = require("../utils/excelParser");
const portfolioData = parseExcelFile();

exports.getHoldings = (req, res) => {
  try {
    const holdings = portfolioData["Holdings"];
    const enriched = holdings.map((stock) => {
      const value = +(stock.Quantity * stock["Current Price (₹)"]).toFixed(2);
      const gainLoss = +(value - stock.Quantity * stock["Avg Price ₹"]).toFixed(2);
      const gainLossPercent = +((gainLoss / (stock.Quantity * stock["Avg Price ₹"])) * 100).toFixed(2);

      return {
        symbol: stock.Symbol,
        name: stock["Company Name"],
        quantity: stock.Quantity,
        avgPrice: stock["Avg Price ₹"],
        currentPrice: stock["Current Price (₹)"],
        sector: stock.Sector,
        marketCap: stock["Market Cap"],
        value,
        gainLoss,
        gainLossPercent,
      };
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Failed to compute holdings." });
  }
};

exports.getAllocation = (req, res) => {
  try {
    const holdings = portfolioData["Holdings"];
    const bySector = {};
    const byMarketCap = {};
    let totalValue = 0;

    holdings.forEach((stock) => {
      const value = stock.Quantity * stock["Current Price (₹)"];
      totalValue += value;

      bySector[stock.Sector] = (bySector[stock.Sector] || 0) + value;
      byMarketCap[stock["Market Cap"]] = (byMarketCap[stock["Market Cap"]] || 0) + value;
    });

    const format = (obj) => {
      const result = {};
      for (const k in obj) {
        result[k] = {
          value: +obj[k].toFixed(2),
          percentage: +((obj[k] / totalValue) * 100).toFixed(1),
        };
      }
      return result;
    };

    res.json({ bySector: format(bySector), byMarketCap: format(byMarketCap) });
  } catch {
    res.status(500).json({ error: "Failed to calculate allocation" });
  }
};

exports.getPerformance = (req, res) => {
  try {
    const data = portfolioData["Historical_Performance"];
 
    const timeline = data.map((row) => ({
      date: row.Date,
      portfolio: row["Portfolio Value (₹)"],
      nifty50: row["Nifty 50"],
      gold: row["Gold (₹/10g)"],
    }));

    res.json( timeline);
  } catch {
    res.status(500).json({ error: "Failed to fetch performance" });
  }
};

exports.getSummary = (req, res) => {
  try {
    const holdings = portfolioData["Holdings"];
    const enriched = holdings.map((stock) => {
      const value = stock.Quantity * stock["Current Price (₹)"];
      const invested = stock.Quantity * stock["Avg Price ₹"];
      const gain = value - invested;
      const gainPercent = (gain / invested) * 100;
      return {
        symbol: stock.Symbol,
        name: stock["Company Name"],
        gainPercent,
        value,
        invested,
      };
    });

    let totalValue = 0,
      totalInvested = 0;

    enriched.forEach((s) => {
      totalValue += s.value;
      totalInvested += s.invested;
    });

    const totalGainLoss = +(totalValue - totalInvested).toFixed(2);
    const totalGainLossPercent = +((totalGainLoss / totalInvested) * 100).toFixed(2);

    const topPerformer = enriched.reduce((a, b) => (a.gainPercent > b.gainPercent ? a : b));
    const worstPerformer = enriched.reduce((a, b) => (a.gainPercent < b.gainPercent ? a : b));

    res.json({
      totalValue: +totalValue.toFixed(2),
      totalInvested: +totalInvested.toFixed(2),
      totalGainLoss,
      totalGainLossPercent,
      topPerformer: {
        symbol: topPerformer.symbol,
        name: topPerformer.name,
        gainPercent: +topPerformer.gainPercent.toFixed(1),
      },
      worstPerformer: {
        symbol: worstPerformer.symbol,
        name: worstPerformer.name,
        gainPercent: +worstPerformer.gainPercent.toFixed(1),
      },
      diversificationScore: portfolioData["Summary"][0]?.DiversificationScore || 8.2,
      riskLevel: portfolioData["Summary"][0]?.RiskLevel || "Moderate",
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to compute summary." });
  }
};