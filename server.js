import express from "express";
import yahooFinance from "yahoo-finance2";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.static("public"));
const port = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API route to fetch stock data
app.get("/api/quote", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  try {
    const quote = await yahooFinance.quote(symbol);
    if (!quote) return res.status(404).json({ error: "Symbol not found" });

    // grading logic
    let grade = "C";
    if (quote.trailingPE && quote.trailingPE < 15) grade = "A";
    else if (quote.trailingPE < 25) grade = "B";
    else if (quote.trailingPE < 40) grade = "C";
    else grade = "D";

    res.json({
      symbol: quote.symbol,
      name: quote.longName,
      price: quote.regularMarketPrice,
      marketCap: quote.marketCap,
      volume: quote.regularMarketVolume,
      pe: quote.trailingPE,
      eps: quote.epsTrailingTwelveMonths,
      grade: grade,
      currency: quote.currency,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
