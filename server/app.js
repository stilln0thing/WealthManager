const express = require("express");
const cors = require("cors");
const portfolioRoutes = require("./routes/portfolioRoutes");
const parseExcelFile = require("./utils/excelParser");

const app = express();
app.use(cors());
app.use(express.json());

// Load data once at startup
const portfolioData = parseExcelFile();

// Inject parsed data into routes via middleware
app.use((req, res, next) => {
    req.portfolioData = portfolioData;
    next();
  });

// API routes
app.use("/api/portfolio", portfolioRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
