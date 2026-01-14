const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DB_PATH = path.join(__dirname, "..", "db.json");

const ensureDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ markets: [] }, null, 2), "utf8");
  }
};

const readDb = () => {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse db.json, recreating file", error);
    fs.writeFileSync(DB_PATH, JSON.stringify({ markets: [] }, null, 2), "utf8");
    return { markets: [] };
  }
};

const writeDb = (db) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
};

const seedDb = () => {
  const db = readDb();
  if (db.markets && db.markets.length > 0) return;

  const now = new Date();
  const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
  const inTenDays = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();

  const baseMarket = (overrides = {}) => ({
    _id: uuidv4(),
    marketField: overrides.marketField ?? 0,
    apiType: overrides.apiType ?? 0,
    task: overrides.task ?? "price",
    creator: overrides.creator ?? "demo_creator",
    tokenA: overrides.tokenA ?? "TokenA111111111111111111111111111111",
    tokenB: overrides.tokenB ?? "TokenB222222222222222222222222222222",
    market: overrides.market ?? "MarketDemo11111111111111111111111111",
    question: overrides.question ?? "Will SOL flip ETH by market cap this year?",
    feedName: overrides.feedName ?? "Solana",
    value: overrides.value ?? 120,
    range: overrides.range ?? 0,
    date: overrides.date ?? inFiveDays,
    marketStatus: overrides.marketStatus ?? "ACTIVE",
    imageUrl: overrides.imageUrl ?? "https://placehold.co/96x96",
    createdAt: overrides.createdAt ?? now.toISOString(),
    playerACount: overrides.playerACount ?? 50,
    playerBCount: overrides.playerBCount ?? 40,
    totalInvestment: overrides.totalInvestment ?? 12,
    tradingAmountA: overrides.tradingAmountA ?? 0,
    tradingAmountB: overrides.tradingAmountB ?? 0,
    tokenAPrice: overrides.tokenAPrice ?? 0,
    tokenBPrice: overrides.tokenBPrice ?? 0,
    description: overrides.description ?? "",
    comments: overrides.comments ?? 0,
    dataLink: overrides.dataLink ?? "",
    feedAddress: overrides.feedAddress ?? "",
    initAmount: overrides.initAmount ?? 0,
    investors: overrides.investors ?? [],
    bets: overrides.bets ?? [],
  });

  db.markets = [
    baseMarket({
      question: "Will Bitcoin reach $120k before year end?",
      feedName: "bitcoin",
      value: 120000,
      totalInvestment: 20.5,
      playerACount: 120,
      playerBCount: 80,
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      marketStatus: "ACTIVE",
      date: inFiveDays,
    }),
    baseMarket({
      question: "Will Ethereum break $5,000 this quarter?",
      feedName: "ethereum",
      value: 5000,
      totalInvestment: 14.2,
      playerACount: 90,
      playerBCount: 60,
      dataLink: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      marketStatus: "ACTIVE",
      date: inTenDays,
    }),
    baseMarket({
      question: "Will Solana flip Ethereum by market cap in 2026?",
      feedName: "solana",
      value: 1,
      totalInvestment: 8.8,
      playerACount: 70,
      playerBCount: 85,
      dataLink: "https://api.coingecko.com/api/v3/coins/markets?ids=solana&vs_currency=usd",
      marketStatus: "PENDING",
      date: inTenDays,
    }),
    baseMarket({
      marketField: 1,
      apiType: 0,
      question: "Will the Lakers score 120+ in their next game?",
      feedName: "Lakers",
      value: 120,
      marketStatus: "PENDING",
      date: inTenDays,
      dataLink: "https://api.sportsdata.io/v3/nba/stats/json/PlayerGameStatsByDate/2024-10-10/LAL",
    }),
    baseMarket({
      marketField: 1,
      apiType: 1,
      question: "Will the Chiefs win their next game?",
      feedName: "Chiefs",
      value: 1,
      marketStatus: "ACTIVE",
      date: inFiveDays,
      dataLink: "https://api.sportsdata.io/v3/nfl/scores/json/Teams",
    }),
  ];

  writeDb(db);
};

module.exports = {
  DB_PATH,
  ensureDb,
  readDb,
  writeDb,
  seedDb,
};
