const express = require("express");
const {
  getHoldings,
  getAllocation,
  getPerformance,
  getSummary,
} = require("../controllers/portfolioController");

const router = express.Router();

router.get("/holdings", getHoldings);
router.get("/allocation", getAllocation);
router.get("/performance", getPerformance);
router.get("/summary", getSummary);

module.exports = router;
