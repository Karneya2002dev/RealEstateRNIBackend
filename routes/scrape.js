// routes/scrape.js
import express from "express";
import cheerio from "cheerio";

// NOTE: If using Node 18+, fetch is built-in.
// If not, install: npm install node-fetch
// and uncomment below:
// import fetch from "node-fetch";

const router = express.Router();

router.get("/scrape", async (req, res) => {
  try {
    const { url, q } = req.query;
    if (!url) return res.status(400).json({ error: "url required" });

    // fetch the html
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html",
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch URL" });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const candidates = new Set();

    // ----------------------------
    // 1. Meta tags
    // ----------------------------
    $('meta[name], meta[property], meta[itemprop]').each((_, el) => {
      const name =
        ($(el).attr("name") ||
          $(el).attr("property") ||
          $(el).attr("itemprop") ||
          ""
        ).toLowerCase();

      const content = $(el).attr("content");

      if (content && /location|address|place|local/i.test(name)) {
        candidates.add(content.trim());
      }
    });

    // ----------------------------
    // 2. Likely selectors
    // ----------------------------
    const selectors = [
      '[data-location]',
      '.location',
      '.place',
      '.address',
      '#location',
      '#address',
      '[itemprop="address"]',
      '[class*="loc"]',
      '[class*="address"]',
      '.project-location',
      '.project-address'
    ];

    selectors.forEach(sel => {
      $(sel).each((_, el) => {
        const text = $(el).text().trim();
        if (text) candidates.add(text);
      });
    });

    // ----------------------------
    // 3. Coordinates
    // ----------------------------
    $('[data-lat],[data-lon],[data-latitude],[data-longitude]').each((_, el) => {
      const lat =
        $(el).attr("data-lat") || $(el).attr("data-latitude");
      const lon =
        $(el).attr("data-lon") || $(el).attr("data-longitude");

      if (lat && lon) {
        candidates.add(`Coordinates: ${lat}, ${lon}`);
      }
    });

    // ----------------------------
    // 4. Fallback: Search body for probable city names
    // ----------------------------
    const bodyText = $("body").text();

    const placeRegex =
      /([A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,}){0,2})(?:\s[-,–|]\s)?(Guduvanchery|Chennai|Tambaram|Coimbatore|Bangalore|Bengaluru|Mumbai|Delhi)?/g;

    let match;
    while ((match = placeRegex.exec(bodyText)) !== null) {
      candidates.add(match[0].trim());
    }

    // cleanup and format
    let suggestions = Array.from(candidates)
      .map(s => s.replace(/\s{2,}/g, " ").trim());

    // ----------------------------
    // 5. Search filter
    // ----------------------------
    if (q) {
      const query = q.toLowerCase();
      suggestions = suggestions.filter(s =>
        s.toLowerCase().includes(query)
      );
    }

    return res.json({ suggestions });
  } catch (error) {
    console.error("SCRAPE ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
