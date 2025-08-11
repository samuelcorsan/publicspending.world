import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { body, query, validationResult } from "express-validator";
import morgan from "morgan";
import compression from "compression";

dotenv.config();

const requiredEnvVars = ["NEWSAPI_KEY"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
  console.warn("GROQ_API_KEY not set - AI summarization disabled");
}

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use(
  cors({
    origin: IS_PRODUCTION
      ? ["https://publicspending.world", "https://www.publicspending.world"]
      : true,
    credentials: true,
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(IS_PRODUCTION ? "combined" : "dev"));

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    error: "Rate limit exceeded. Try again in 5 minutes.",
    retryAfter: "5 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: IS_PRODUCTION,
});

app.use("/api/", limiter);

// Request validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// Top 20 countries with political controversy keywords
const COUNTRIES = {
  us: {
    name: "United States",
    keywords: [
      "debt ceiling",
      "tax reform",
      "government shutdown",
      "impeachment",
      "election fraud",
      "Supreme Court",
      "abortion rights",
      "January 6",
      "Trump investigation",
      "classified documents",
      "Federal Reserve",
      "Jerome Powell",
    ],
    searchTerms: [
      "United States",
      "America",
      "Congress",
      "Senate",
      "House",
      "Biden",
      "Trump",
      "Republican",
      "Democrat",
      "GOP",
    ],
    domains:
      "cnn.com,foxnews.com,politico.com,washingtonpost.com,nytimes.com,reuters.com,apnews.com,nbcnews.com,cbsnews.com,abcnews.go.com,wsj.com,npr.org,thehill.com",
  },
  uk: {
    name: "United Kingdom",
    keywords: [
      "Brexit",
      "parliament",
      "prime minister",
      "conservative party",
      "labour party",
      "Scotland independence",
      "Northern Ireland",
      "Tory",
      "constitutional crisis",
    ],
    searchTerms: [
      "United Kingdom",
      "Britain",
      "UK",
      "Parliament",
      "Westminster",
      "Downing Street",
      "Conservative",
      "Labour",
      "Tory",
    ],
    domains:
      "bbc.com,theguardian.com,telegraph.co.uk,independent.co.uk,sky.com,reuters.com",
  },
  fr: {
    name: "France",
    keywords: [
      "Emmanuel Macron",
      "parliament",
      "pension reform",
      "yellow vests",
      "Marine Le Pen",
      "immigration",
      "European Union",
      "riots",
    ],
    searchTerms: [
      "France",
      "French",
      "Paris",
      "Macron",
      "Assemblée",
      "République",
      "EU",
      "European Union",
    ],
    domains:
      "lemonde.fr,lefigaro.fr,liberation.fr,franceinfo.fr,reuters.com,france24.com",
  },
  de: {
    name: "Germany",
    keywords: [
      "coalition government",
      "bundestag",
      "Angela Merkel",
      "Olaf Scholz",
      "AfD",
      "immigration",
      "energy crisis",
      "Russia sanctions",
    ],
    searchTerms: [
      "Germany",
      "German",
      "Berlin",
      "Bundestag",
      "Chancellor",
      "CDU",
      "SPD",
      "AfD",
    ],
    domains: "spiegel.de,zeit.de,faz.net,sueddeutsche.de,reuters.com,dw.com",
  },
  cn: {
    name: "China",
    keywords: [
      "Xi Jinping",
      "Communist Party",
      "Hong Kong",
      "Taiwan",
      "Xinjiang",
      "trade war",
      "censorship",
      "protests",
      "human rights",
    ],
    searchTerms: [
      "China",
      "Chinese",
      "Beijing",
      "Communist Party",
      "Xi Jinping",
      "CCP",
      "Taiwan",
      "Hong Kong",
    ],
    domains: "reuters.com,apnews.com,bbc.com,cnn.com,wsj.com,ft.com",
  },
  ru: {
    name: "Russia",
    keywords: [
      "Putin",
      "Ukraine war",
      "sanctions",
      "opposition",
      "Kremlin",
      "election",
      "protests",
      "oligarchs",
      "corruption",
    ],
    searchTerms: [
      "Russia",
      "Russian",
      "Moscow",
      "Putin",
      "Kremlin",
      "Ukraine",
      "sanctions",
    ],
    domains: "reuters.com,apnews.com,bbc.com,cnn.com,wsj.com,ft.com",
  },
  in: {
    name: "India",
    keywords: [
      "Modi",
      "BJP",
      "Congress",
      "Kashmir",
      "farmers protest",
      "citizenship law",
      "Hindu nationalism",
      "parliament",
    ],
    searchTerms: [
      "India",
      "Indian",
      "New Delhi",
      "Modi",
      "BJP",
      "Congress",
      "Parliament",
    ],
    domains:
      "timesofindia.indiatimes.com,hindustantimes.com,indianexpress.com,reuters.com,bbc.com",
  },
  br: {
    name: "Brazil",
    keywords: [
      "Bolsonaro",
      "Lula",
      "Amazon",
      "corruption",
      "Supreme Court",
      "election",
      "military",
      "democracy",
    ],
    searchTerms: [
      "Brazil",
      "Brazilian",
      "Brasilia",
      "Bolsonaro",
      "Lula",
      "Congress",
    ],
    domains: "reuters.com,apnews.com,bbc.com,cnn.com",
  },
  jp: {
    name: "Japan",
    keywords: [
      "LDP",
      "prime minister",
      "constitution",
      "North Korea",
      "China tensions",
      "election",
      "Fukushima",
      "defense spending",
    ],
    searchTerms: [
      "Japan",
      "Japanese",
      "Tokyo",
      "Diet",
      "LDP",
      "Prime Minister",
    ],
    domains: "japantimes.co.jp,nhk.or.jp,reuters.com,bbc.com",
  },
  ca: {
    name: "Canada",
    keywords: [
      "Trudeau",
      "parliament",
      "conservative party",
      "Quebec",
      "indigenous rights",
      "pipeline",
      "election",
      "carbon tax",
    ],
    searchTerms: [
      "Canada",
      "Canadian",
      "Ottawa",
      "Trudeau",
      "Parliament",
      "Conservative",
      "Liberal",
    ],
    domains: "cbc.ca,globalnews.ca,theglobeandmail.com,reuters.com",
  },
  au: {
    name: "Australia",
    keywords: [
      "parliament",
      "labor party",
      "liberal party",
      "climate change",
      "mining",
      "China relations",
      "election",
    ],
    searchTerms: [
      "Australia",
      "Australian",
      "Canberra",
      "Parliament",
      "Labor",
      "Liberal",
    ],
    domains: "abc.net.au,news.com.au,theaustralian.com.au,reuters.com",
  },
  mx: {
    name: "Mexico",
    keywords: [
      "AMLO",
      "MORENA",
      "corruption",
      "cartels",
      "immigration",
      "election",
      "congress",
    ],
    searchTerms: [
      "Mexico",
      "Mexican",
      "Mexico City",
      "AMLO",
      "MORENA",
      "Congress",
    ],
    domains: "reuters.com,apnews.com,bbc.com",
  },
  kr: {
    name: "South Korea",
    keywords: [
      "president",
      "National Assembly",
      "North Korea",
      "impeachment",
      "corruption",
      "chaebol",
      "election",
    ],
    searchTerms: [
      "South Korea",
      "Korean",
      "Seoul",
      "President",
      "National Assembly",
    ],
    domains: "koreatimes.co.kr,koreaherald.com,reuters.com,bbc.com",
  },
  it: {
    name: "Italy",
    keywords: [
      "Giorgia Meloni",
      "parliament",
      "coalition",
      "EU",
      "immigration",
      "Matteo Salvini",
      "election",
    ],
    searchTerms: [
      "Italy",
      "Italian",
      "Rome",
      "Parliament",
      "EU",
      "European Union",
    ],
    domains: "reuters.com,apnews.com,bbc.com",
  },
  es: {
    name: "Spain",
    keywords: [
      "Pedro Sanchez",
      "parliament",
      "Catalonia",
      "independence",
      "PP",
      "PSOE",
      "Vox",
      "election",
    ],
    searchTerms: ["Spain", "Spanish", "Madrid", "Parliament", "Catalonia"],
    domains: "reuters.com,apnews.com,bbc.com",
  },
  ar: {
    name: "Argentina",
    keywords: [
      "president",
      "congress",
      "inflation",
      "IMF",
      "Peronism",
      "economic crisis",
      "election",
    ],
    searchTerms: ["Argentina", "Argentine", "Buenos Aires", "Congress"],
    domains: "reuters.com,apnews.com,bbc.com",
  },
  za: {
    name: "South Africa",
    keywords: [
      "ANC",
      "parliament",
      "corruption",
      "load shedding",
      "EFF",
      "DA",
      "election",
      "Ramaphosa",
    ],
    searchTerms: [
      "South Africa",
      "African",
      "Cape Town",
      "Johannesburg",
      "ANC",
      "Parliament",
    ],
    domains: "reuters.com,apnews.com,bbc.com",
  },
  ng: {
    name: "Nigeria",
    keywords: [
      "president",
      "National Assembly",
      "Boko Haram",
      "corruption",
      "oil",
      "election",
      "security",
    ],
    searchTerms: ["Nigeria", "Nigerian", "Abuja", "Lagos", "National Assembly"],
    domains: "reuters.com,apnews.com,bbc.com",
  },
  eg: {
    name: "Egypt",
    keywords: [
      "Sisi",
      "parliament",
      "human rights",
      "military",
      "Muslim Brotherhood",
      "economy",
      "protests",
    ],
    searchTerms: ["Egypt", "Egyptian", "Cairo", "Sisi", "Parliament"],
    domains: "reuters.com,apnews.com,bbc.com",
  },
  tr: {
    name: "Turkey",
    keywords: [
      "Erdogan",
      "parliament",
      "opposition",
      "election",
      "military",
      "Syria",
      "human rights",
      "economy",
    ],
    searchTerms: [
      "Turkey",
      "Turkish",
      "Ankara",
      "Istanbul",
      "Erdogan",
      "Parliament",
    ],
    domains: "reuters.com,apnews.com,bbc.com",
  },
};

// Default fallback keywords for unknown countries
const DEFAULT_POLITICAL_KEYWORDS = [
  "government",
  "parliament",
  "election",
  "corruption",
  "protest",
  "opposition",
  "crisis",
  "scandal",
  "controversy",
  "political",
];

function validateQueryLength(keywords, searchTerms) {
  const testQuery =
    "(" +
    keywords
      .map((k) =>
        /\s/.test(k) ? `"${k.replace(/"/g, "")}"` : k.replace(/"/g, "")
      )
      .join(" OR ") +
    ") AND (" +
    searchTerms.join(" OR ") +
    ")";

  return {
    query: testQuery,
    length: testQuery.length,
    isValid: testQuery.length <= 500,
  };
}

async function fetchPoliticalNews(
  countryCode = "us",
  customKeywords = null,
  limit = 50
) {
  const API_KEY = process.env.NEWSAPI_KEY;
  if (!API_KEY) {
    throw new Error("NEWSAPI_KEY environment variable is required");
  }

  // Get country configuration
  const country = COUNTRIES[countryCode.toLowerCase()];
  if (!country) {
    throw new Error(
      `Unsupported country code: ${countryCode}. Supported countries: ${Object.keys(
        COUNTRIES
      ).join(", ")}`
    );
  }

  const keywords = customKeywords || country.keywords;
  const searchTerms = country.searchTerms;
  const domains = country.domains;

  // Validate query length
  const validation = validateQueryLength(keywords, searchTerms);
  if (!validation.isValid) {
    throw new Error(
      `Query too long (${validation.length} chars). NewsAPI limit is 500 chars. Try fewer keywords.`
    );
  }

  const q = validation.query;

  const params = new URLSearchParams({
    q,
    language: "en",
    pageSize: String(Math.min(limit, 100)),
    sortBy: "relevancy",
    domains: domains,
  });

  const url = `https://newsapi.org/v2/everything?${params.toString()}`;

  const response = await fetch(url, {
    headers: { "X-Api-Key": API_KEY },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `NewsAPI error: ${response.status} ${response.statusText} ${errorText}`
    );
  }

  const data = await response.json();
  return data;
}

function filterPoliticalControversies(articles) {
  const controversyIndicators = [
    "debate",
    "controversy",
    "dispute",
    "opposition",
    "criticism",
    "conflict",
    "divided",
    "polarized",
    "partisan",
    "scandal",
    "investigation",
    "allegation",
    "protest",
    "lawsuit",
    "impeach",
    "resign",
    "corruption",
    "fraud",
    "tensions",
    "clash",
    "disagreement",
    "pressure",
    "independence",
  ];

  return articles.filter((article) => {
    const text = `${article.title} ${article.description || ""}`.toLowerCase();
    return controversyIndicators.some((indicator) => text.includes(indicator));
  });
}

async function generatePoliticalSummary(articles, countryCode) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return "AI summarization unavailable - GROQ_API_KEY not configured.";
  }

  const groq = new Groq({ apiKey: GROQ_API_KEY });
  const country = COUNTRIES[countryCode.toLowerCase()];
  const countryName = country ? country.name : "the country";

  // Create a consolidated text from articles
  const articlesText = articles
    .slice(0, 5) // Use top 5 articles to avoid token limits
    .map(
      (article, i) =>
        `Article ${i + 1}: ${article.title}. ${article.description || ""}`
    )
    .join("\n\n");

  const prompt = `Create a political summary for ${countryName} based on these news articles. Write ONLY the summary, no explanations.

Style example: "There is an ongoing and highly politicized debate over raising the federal debt ceiling to avoid default, as well as concerns about the long-term sustainability of large deficits accumulated during and after the COVID-19 pandemic. The Biden administration's proposed tax reforms targeting high earners and corporate rate adjustments have sparked heated discussions on fairness, economic growth impact, and potential revenue shortfalls."

Requirements:
- Use phrases like "ongoing debate", "concerns about", "sparked heated discussions", "tensions have emerged" 
- Focus on political tensions and controversies in ${countryName}
- 2-4 sentences maximum
- Flowing, analytical tone
- Connect issues to broader political conflicts

Articles:
${articlesText}

Summary:`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
      max_tokens: 400,
    });

    // GPT-OSS models return content in the reasoning field
    const content = completion.choices[0]?.message?.content?.trim();
    const reasoning = completion.choices[0]?.message?.reasoning?.trim();

    let summary = content || reasoning;

    if (!summary) {
      return "AI response was empty.";
    }

    // Clean up the response to extract only the final summary
    if (reasoning) {
      // Look for common patterns that indicate the start of the actual summary
      const patterns = [
        /So we might say:\s*"([^"]+)"/,
        /Political summary:\s*"([^"]+)"/,
        /Summary:\s*"([^"]+)"/,
        /"(There is an ongoing[^"]+)"/,
        /"(The [^"]*government[^"]+)"/,
        /"(Tensions have emerged[^"]+)"/,
      ];

      for (const pattern of patterns) {
        const match = reasoning.match(pattern);
        if (match) {
          return match[1];
        }
      }

      // If no specific pattern found, look for the last quoted sentence
      const lastQuoteMatch = reasoning.match(/"([^"]{50,})"[^"]*$/);
      if (lastQuoteMatch) {
        return lastQuoteMatch[1];
      }

      // If reasoning contains explanation text, try to extract clean summary
      if (
        reasoning.includes("We need to") ||
        reasoning.includes("style:") ||
        reasoning.includes("requirements:")
      ) {
        // Find the actual summary after all the explanation
        const lines = reasoning.split("\n");
        for (let i = lines.length - 1; i >= 0; i--) {
          const line = lines[i].trim();
          if (
            line.length > 100 &&
            line.includes("ongoing") &&
            !line.includes("We need")
          ) {
            return line.replace(/^["']|["']$/g, ""); // Remove quotes if present
          }
        }
      }
    }

    // If content field has the clean summary, use it
    if (content && content.length > 50 && !content.includes("We need to")) {
      return content;
    }

    // Fallback to reasoning but try to clean it up
    return summary.replace(/^["']|["']$/g, ""); // Remove surrounding quotes
  } catch (error) {
    console.error("❌ AI Summary Error Details:");
    console.error("Error message:", error.message);
    console.error("Error status:", error.status);

    if (error.message.includes("401") || error.status === 401) {
      return "AI summarization failed - Invalid GROQ_API_KEY.";
    } else if (error.message.includes("429") || error.status === 429) {
      return "AI summarization failed - Rate limit exceeded.";
    } else if (error.message.includes("model")) {
      return "AI summarization failed - Model not available.";
    } else {
      return `AI summarization failed - ${error.message}`;
    }
  }
}

// Validation rules for the main endpoint
const politicalControversiesValidation = [
  query("country")
    .optional()
    .isAlpha()
    .isLength({ min: 2, max: 2 })
    .withMessage("Country must be a 2-character country code"),

  query("keywords")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Keywords must be less than 200 characters")
    .customSanitizer((value) => {
      // Sanitize keywords by removing potentially harmful characters
      return value ? value.replace(/[<>{}()]/g, "").trim() : value;
    }),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("filter")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Filter must be true or false"),

  query("summary")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Summary must be true or false"),
];

app.get(
  "/api/political-controversies",
  politicalControversiesValidation,
  handleValidationErrors,
  async (req, res) => {
    const startTime = Date.now();

    try {
      const {
        country = "us",
        keywords,
        limit = 30,
        filter = "true",
        summary = "true",
      } = req.query;

      // Additional country validation
      if (!COUNTRIES[country.toLowerCase()]) {
        return res.status(400).json({
          success: false,
          error: `Unsupported country code: ${country}`,
          supportedCountries: Object.keys(COUNTRIES),
          message: "Please use a valid 2-character country code",
        });
      }

      const customKeywords = keywords
        ? keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : null;

      // Validate keywords length
      if (customKeywords && customKeywords.some((k) => k.length > 50)) {
        return res.status(400).json({
          success: false,
          error: "Individual keywords must be less than 50 characters",
        });
      }

      const data = await fetchPoliticalNews(
        country,
        customKeywords,
        parseInt(limit)
      );
      let articles = data.articles || [];

      if (filter === "true") {
        articles = filterPoliticalControversies(articles);
      }

      const formattedArticles = articles.map((article) => ({
        title: article.title,
        description: article.description,
        source: article.source?.name,
        author: article.author,
        publishedAt: article.publishedAt,
        url: article.url,
        urlToImage: article.urlToImage,
      }));

      // Generate AI summary if requested
      let aiSummary = null;
      if (
        summary === "true" &&
        articles.length > 0 &&
        process.env.GROQ_API_KEY
      ) {
        console.log(
          `🤖 Generating AI summary for ${
            COUNTRIES[country.toLowerCase()]?.name || country
          }...`
        );
        aiSummary = await generatePoliticalSummary(articles, country);
      }

      res.json({
        success: true,
        country: COUNTRIES[country.toLowerCase()]?.name || country,
        countryCode: country.toLowerCase(),
        total: formattedArticles.length,
        aiSummary: aiSummary,
        articles: formattedArticles,
      });
    } catch (error) {
      console.error("API Error:", error.message);

      const errorMessage =
        IS_PRODUCTION && !error.isOperational
          ? "Internal server error"
          : error.message;

      res.status(error.statusCode || 500).json({
        success: false,
        error: errorMessage,
      });
    }
  }
);

app.get("/health", (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    services: {
      newsapi: !!process.env.NEWSAPI_KEY,
      groq: !!process.env.GROQ_API_KEY,
    },
  };

  res.json(healthCheck);
});

app.get("/", (req, res) => {
  res.json({
    message: "Global Political Controversies API with AI Summarization",
    description:
      "Production-ready API to get political controversies from 20 major countries with AI-powered summaries",
    version: "2.0.0",
    endpoints: {
      "/api/political-controversies":
        "Get latest political controversies with AI summary",
      "/health": "Health check and service status",
    },
    parameters: {
      country: "Country code (default: 'us'). See supported countries below",
      keywords:
        "Custom comma-separated keywords (max 200 chars, individual keywords max 50 chars)",
      limit: "Number of articles (default: 30, max: 100)",
      filter: "Filter for controversies (default: true)",
      summary: "Generate AI summary (default: true)",
    },

    usage: {
      "US politics (default)": "/api/political-controversies",
      "UK politics": "/api/political-controversies?country=uk",
      "French politics": "/api/political-controversies?country=fr",

      "Custom keywords":
        "/api/political-controversies?country=us&keywords=Federal Reserve,Jerome Powell",
      "Multiple options":
        "/api/political-controversies?country=de&limit=10&summary=false",
    },
    supportedCountries: Object.keys(COUNTRIES).map((code) => ({
      code: code,
      name: COUNTRIES[code].name,
    })),
    rateLimits: {
      limit: "5 requests per 5 minutes",
      note: "Requests blocked after limit reached",
    },
    security: {
      helmet: "Security headers enabled",
      cors: IS_PRODUCTION
        ? "Restricted to publicspending.world"
        : "All origins allowed",
      validation: "Input validation and sanitization",
      logging: "Request logging enabled",
    },
    limitations: {
      "Query length": "NewsAPI limits queries to 500 characters",
      Keywords: "Use fewer keywords if you get 'queryTooLong' error",
      Languages: "Results are filtered to English-language sources",
    },
    env_required: ["NEWSAPI_KEY"],
    env_optional: ["GROQ_API_KEY", "NODE_ENV"],
    status: {
      newsapi: !!process.env.NEWSAPI_KEY,
      ai: !!process.env.GROQ_API_KEY,
      environment: process.env.NODE_ENV || "development",
    },
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: ["/api/political-controversies", "/health", "/"],
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled Error:", error.message);

  const errorMessage =
    IS_PRODUCTION && !error.isOperational
      ? "Internal server error"
      : error.message;

  res.status(error.statusCode || 500).json({
    success: false,
    error: errorMessage,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Political Controversies API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Rate limit: 5 requests per 5 minutes`);
  console.log(`AI: ${process.env.GROQ_API_KEY ? "Enabled" : "Disabled"}`);
});
