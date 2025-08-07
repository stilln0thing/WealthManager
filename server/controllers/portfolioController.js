// File: src/controllers/portfolioController.js
const parseExcelFile = require("../utils/excelParser");
const portfolioData = parseExcelFile();

/**
 * Route: GET /api/portfolio/holdings
 * Logic:
 * 1. Retrieve 'Holdings' sheet data from parsed Excel.
 * 2. For each stock:
 *    - Calculate current value = Quantity * Current Price.
 *    - Determine gainLoss = value - (Quantity * Avg Price).
 *    - Compute gainLossPercent = (gainLoss / (Quantity * Avg Price)) * 100.
 * 3. Return enriched array of holdings with symbol, name, quantity, avgPrice,
 *    currentPrice, sector, marketCap, value, gainLoss, and gainLossPercent.
 */
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

/**
 * Route: GET /api/portfolio/allocation
 * Logic:
 * 1. Retrieve 'Holdings' sheet data.
 * 2. Initialize accumulators: bySector{}, byMarketCap{}, totalValue = 0.
 * 3. For each stock:
 *    - Compute value = Quantity * Current Price.
 *    - Add to totalValue.
 *    - Sum sector and marketCap totals.
 * 4. Format each category to include value and percentage of totalValue.
 * 5. Return { bySector: {...}, byMarketCap: {...} }.
 */
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

/**
 * Route: GET /api/portfolio/performance
 * Logic:
 * 1. Retrieve 'Historical_Performance' sheet data.
 * 2. Map each row to timeline entries with fields:
 *    - date (YYYY-MM-DD), portfolio, nifty50, gold.
 * 3. Extract returns metrics from first row of 'Summary' sheet.
 * 4. Return { timeline: [...], returns: {...} }.
 */
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

/**
 * Route: GET /api/portfolio/summary
 * Logic:
 * 1. Retrieve 'Holdings' and first row of 'Summary' sheet.
 * 2. For each stock:
 *    - Compute value = Quantity * Current Price.
 *    - Compute invested = Quantity * Avg Price.
 *    - Compute gain = value - invested and gainPercent.
 * 3. Sum totalValue and totalInvested across all stocks.
 * 4. Calculate totalGainLoss and totalGainLossPercent.
 * 5. Identify topPerformers and worstPerformers by gainPercent.
 * 6. Include diversificationScore and riskLevel from Summary sheet.
 * 7. Return comprehensive summary object.
 */
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