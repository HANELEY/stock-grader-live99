const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Stock Grader API is running!");
});

app.get("/stock/:ticker", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`);
    const data = response.data.quoteSummary.result[0].price;

    res.json({
      ticker: data.symbol,
      name: data.longName,
      exchange: data.exchangeName,
      currency: data.currency,
      price: data.regularMarketPrice.raw,
      marketCap: data.marketCap ? data.marketCap.fmt : "N/A"
    });
  } catch (error) {
    res.status(404).json({ error: "Ticker not found or invalid." });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
