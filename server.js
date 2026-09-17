import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createWorker } from 'tesseract.js';
import dotenv from 'dotenv';

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Known Falsehoods & Scientific/Astronomical Errors
const knownFalsehoods = [
  // Astronomical & Scientific
  { pattern: /sun\s+rises?\s+(in|from)?\s*(the\s+)?west/i, reason: 'Astronomical fact error: The Sun rises in the East and sets in the West.' },
  { pattern: /sun\s+sets?\s+(in|from)?\s*(the\s+)?east/i, reason: 'Astronomical fact error: The Sun sets in the West, not the East.' },
  { pattern: /earth\s+is\s+flat/i, reason: 'Scientific falsehood: The Earth is an oblate spheroid, not flat.' },
  { pattern: /flat\s+earth/i, reason: 'Disproven conspiracy theory / scientific falsehood.' },
  { pattern: /moon\s+landing\s+(was|is)\s+(fake|staged|hoax)/i, reason: 'Disproven conspiracy theory regarding Apollo moon landings.' },
  { pattern: /water\s+boils?\s+at\s+0/i, reason: 'Physical science error: Water boils at 100°C (212°F) at standard pressure.' },
  { pattern: /water\s+freezes?\s+at\s+100/i, reason: 'Physical science error: Water freezes at 0°C (32°F) at standard pressure.' },
  { pattern: /gravity\s+(does\s+not\s+exist|is\s+a\s+myth|is\s+fake)/i, reason: 'Physical science falsehood: Gravity is a fundamental physical interaction.' },
  { pattern: /humans?\s+(don't|do\s+not|can\s+live\s+without)\s+need\s+oxygen/i, reason: 'Biological falsehood: Humans require oxygen for cellular respiration.' },

  // Health Misinformation
  { pattern: /bleach\s+(cures?|heals?|treats?)/i, reason: 'Dangerous health misinformation: Ingesting bleach is hazardous and toxic.' },
  { pattern: /5g\s+(causes?|spreads?)\s+(covid|virus|radiation\s+poisoning)/i, reason: 'Disproven technology conspiracy theory.' },
  { pattern: /vaccines?\s+cause\s+autism/i, reason: 'Thoroughly debunked medical claim.' },

  // Viral Indian Misinformation & Hoaxes
  { pattern: /unesco\s+.*(declared|named|awarded|voted|chosen).*(best|national\s+anthem)/i, reason: 'Disproven viral hoax: UNESCO does not declare "best national anthem" or similar viral titles.' },
  { pattern: /2000\s+(rupee|rs)?\s*note\s+.*(nano|gps|micro)\s*chip/i, reason: 'Disproven financial rumor: Currency notes do not contain nano or GPS tracking chips.' },
  { pattern: /whatsapp\s+.*(charged|paid)\s+from\s+(tomorrow|next\s+month)/i, reason: 'Disproven viral chain letter: WhatsApp standard messaging remains free.' },
  { pattern: /forward(ed)?\s+.*to\s+\d+\s+(people|groups|friends|whatsapp)/i, reason: 'Classic viral chain letter / WhatsApp forward pattern.' },
  { pattern: /government\s+.*(giving|offering|providing|distributing)\s+free\s+(laptops?|smartphones?|money)/i, reason: 'Common scam / phishing alert: Government schemes require verification on official (.gov.in) portals.' },
  { pattern: /free\s+recharge\s+for\s+\d+\s+(months?|days?)/i, reason: 'Phishing scam warning: Promotes fake telecom recharge offers.' }
];

// Verified Real-World Entity Knowledge Base (Indian & Global)
const verifiedRealWorldFacts = [
  {
    keywords: ['cm of andhra', 'chief minister of andhra', 'andhra cm', 'andhra pradesh cm', 'andhra pradesh chief minister'],
    correctEntities: ['chandrababu', 'naidu', 'cbn'],
    title: 'N. Chandrababu Naidu',
    correctFact: 'N. Chandrababu Naidu is the Chief Minister of Andhra Pradesh.',
  },
  {
    keywords: ['cm of telangana', 'chief minister of telangana', 'telangana cm', 'telangana chief minister'],
    correctEntities: ['revanth', 'reddy'],
    title: 'Anumula Revanth Reddy',
    correctFact: 'Anumula Revanth Reddy is the Chief Minister of Telangana.',
  },
  {
    keywords: ['cm of tamil nadu', 'chief minister of tamil nadu', 'tamil nadu cm'],
    correctEntities: ['stalin', 'm.k. stalin', 'mk stalin'],
    title: 'M. K. Stalin',
    correctFact: 'M. K. Stalin is the Chief Minister of Tamil Nadu.',
  },
  {
    keywords: ['cm of karnataka', 'chief minister of karnataka', 'karnataka cm'],
    correctEntities: ['siddaramaiah'],
    title: 'Siddaramaiah',
    correctFact: 'Siddaramaiah is the Chief Minister of Karnataka.',
  },
  {
    keywords: ['cm of west bengal', 'chief minister of west bengal', 'west bengal cm'],
    correctEntities: ['mamata', 'banerjee'],
    title: 'Mamata Banerjee',
    correctFact: 'Mamata Banerjee is the Chief Minister of West Bengal.',
  },
  {
    keywords: ['cm of uttar pradesh', 'chief minister of uttar pradesh', 'up cm'],
    correctEntities: ['yogi', 'adityanath'],
    title: 'Yogi Adityanath',
    correctFact: 'Yogi Adityanath is the Chief Minister of Uttar Pradesh.',
  },
  {
    keywords: ['pm of india', 'prime minister of india'],
    correctEntities: ['narendra', 'modi'],
    title: 'Narendra Modi',
    correctFact: 'Narendra Modi is the Prime Minister of India.',
  },
  {
    keywords: ['president of india'],
    correctEntities: ['droupadi', 'murmu'],
    title: 'Droupadi Murmu',
    correctFact: 'Droupadi Murmu is the President of India.',
  },
  {
    keywords: ['isro', 'chandrayaan'],
    correctEntities: ['chandrayaan-3', 'lunar', 'moon', 'isro', 'space'],
    title: 'Chandrayaan-3 Mission',
    correctFact: 'ISRO successfully conducted the Chandrayaan-3 lunar lander mission.',
  }
];

const fakeIndicators = [
  'secret',
  'conspiracy',
  'hoax',
  'ban all',
  'you won\'t believe',
  'shocking',
  'what they don\'t want you to know',
  'miracle cure',
  'exposed',
  'guaranteed',
  'no one tells you',
  'big pharma',
  'plandemic',
  '5g causes',
  'deep state',
  'chemtrails',
  'secret plan',
  'government cover-up',
  'anonymous source',
  'everyone is talking',
  'this will change everything',
  'breaking',
  'must read',
  'share now',
  'fact check this',
  'forwarded as received',
  'share before deleted',
];

const realIndicators = [
  'according to',
  'reported by',
  'official statement',
  'study shows',
  'research published',
  'data from',
  'peer-reviewed',
  'pib fact check',
  'alt news',
  'boom live',
  'factly',
  'press information bureau',
  'supreme court',
  'reserve bank of india',
  'rbi',
  'isro',
  'nasa',
  'cdc',
  'who',
  'aiims',
  'icmr',
  'university',
  'researchers',
  'health experts',
  'scientists say',
  'verified by',
  'confirmed by',
  'analysis shows',
];

const suspiciousDomains = [
  'infowars',
  'naturalnews',
  'beforeitsnews',
  'worldtruth',
  'dailystormer',
  'zerohedge',
  'yournewswire',
  'epochtimes',
  'breitbart',
  'dailybuzz',
];

const credibleDomains = [
  'pib.gov.in',
  'altnews.in',
  'boomlive.in',
  'factly.in',
  'thequint.com',
  'hindustantimes.com',
  'indianexpress.com',
  'ndtv.com',
  'thehindu.com',
  'indiatoday.in',
  'bbc.com',
  'cnn.com',
  'reuters.com',
  'apnews.com',
  'nytimes.com',
  'theguardian.com',
  'washingtonpost.com',
  'nature.com',
  'who.int',
  'nasa.gov',
];

const normalizeText = (value = '') => value.toLowerCase().replace(/\s+/g, ' ').trim();

const stripHtml = (value = '') =>
  value.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const countMatches = (value, list) =>
  list.reduce((count, phrase) => (value.includes(phrase) ? count + 1 : count), 0);

const extractDomain = (value = '') => {
  try {
    const maybeUrl = value.startsWith('http') ? value : `https://${value}`;
    const parsed = new URL(maybeUrl);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

async function fetchUrlContent(url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with ${response.status}`);
    }

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? stripHtml(titleMatch[1]) : '';
    const bodyText = stripHtml(html);
    const preview = `${title} ${bodyText}`.trim();

    return preview.length > 0 ? preview : url;
  } catch {
    return url;
  }
}

async function extractImageText(buffer) {
  try {
    const worker = await createWorker('eng');
    const { data } = await worker.recognize(buffer);
    await worker.terminate();
    return data.text ? data.text.trim() : '';
  } catch {
    return '';
  }
}

// Live Wikipedia Knowledge Graph Verification (Free HTTP API)
async function verifyWithWikipedia(text) {
  try {
    const cleanText = text.trim();
    if (cleanText.length < 15) return null; // Avoid matching short idioms / movie titles

    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanText)}&utf8=&format=json&origin=*`;
    const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'HonestEye/1.0' } });
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const searchResults = searchData.query?.search;
    if (!searchResults || searchResults.length === 0) return null;

    const topTitle = searchResults[0].title;
    // Exclude film/album disambiguation pages for simple factual claim checks
    if (topTitle.toLowerCase().includes('(film)') || topTitle.toLowerCase().includes('(song)') || topTitle.toLowerCase().includes('(album)')) {
      return null;
    }

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle.replace(/ /g, '_'))}`;
    const summaryRes = await fetch(summaryUrl, { headers: { 'User-Agent': 'HonestEye/1.0' } });
    if (!summaryRes.ok) return null;

    const summaryData = await summaryRes.json();
    const extract = (summaryData.extract || '').toLowerCase();
    const lowerText = cleanText.toLowerCase();

    // Check if the claim contains subject & predicate matching Wikipedia page summary
    const words = lowerText.split(/\s+/).filter((w) => w.length > 3);
    const matchCount = words.reduce((acc, word) => (extract.includes(word) ? acc + 1 : acc), 0);

    if (words.length > 0 && matchCount / words.length >= 0.6) {
      return {
        verified: true,
        title: summaryData.title,
        extract: summaryData.extract,
      };
    }
  } catch (err) {
    console.warn('Wikipedia REST verification skipped:', err.message);
  }
  return null;
}

async function analyzeContent(sourceText, sourceType = 'text') {
  const text = normalizeText(sourceText || '');
  if (!text) {
    return {
      score: 0,
      explanation: 'No usable content was provided for analysis.',
      redFlags: ['Missing input content'],
      trustedSources: [],
      educationalTips: ['Add a clearer claim, URL, or image to evaluate.'],
      factCheck: [],
      confidence: 0,
      timestamp: new Date().toISOString(),
    };
  }

  const domain = extractDomain(text);
  const redFlags = [];
  let trustedSources = [];
  const realCount = countMatches(text, realIndicators);
  const isExplicitFactCheckReport = text.includes('pib fact check') || text.includes('fact check:') || text.includes('debunked by') || (text.includes('according to') && text.includes('not'));

  // 1. Check known factual & scientific falsehoods FIRST
  let directFalsehoodFound = false;
  if (!isExplicitFactCheckReport) {
    for (const falsehood of knownFalsehoods) {
      if (falsehood.pattern.test(text)) {
        directFalsehoodFound = true;
        return {
          score: 0,
          explanation: 'This claim contradicts verified astronomical, scientific, or factual knowledge.',
          redFlags: [falsehood.reason],
          trustedSources: ['PIB Fact Check', 'Alt News', 'Reuters', 'BBC'],
          educationalTips: [
            'Verify scientific, astronomical, and medical claims with official textbooks or accredited news agencies.',
          ],
          factCheck: [{ claim: sourceText, rating: 'False', source: 'Scientific/Astronomical Knowledge Base' }],
          confidence: 95,
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  // 2. Check Real-World Entity Knowledge Base SECOND
  for (const fact of verifiedRealWorldFacts) {
    const hasKeyword = fact.keywords.some((kw) => text.includes(kw));
    if (hasKeyword) {
      const hasCorrectEntity = fact.correctEntities.some((entity) => text.includes(entity));
      if (hasCorrectEntity) {
        return {
          score: 92,
          explanation: `Verified real-world news fact: ${fact.correctFact}`,
          redFlags: [],
          trustedSources: ['PIB Fact Check', 'Wikipedia Knowledge Base', 'Reuters', 'Official Govt Portal'],
          educationalTips: [
            'This fact matches verified real-world news and official records.',
            'Cross-check political officeholders on official government portals (.gov.in).',
          ],
          factCheck: [{ claim: sourceText, rating: 'Verified True', source: 'Honest Eye Knowledge Base' }],
          confidence: 95,
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          score: 15,
          explanation: `Real-world news contradiction: The claim is inaccurate. ${fact.correctFact}`,
          redFlags: [`Factual error detected. ${fact.correctFact}`],
          trustedSources: ['PIB Fact Check', 'Wikipedia Knowledge Base', 'Official Govt Portal'],
          educationalTips: ['Always verify official officeholders and news claims on primary sources.'],
          factCheck: [{ claim: sourceText, rating: 'False', source: 'Honest Eye Knowledge Base' }],
          confidence: 90,
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  // 3. Check Live Wikipedia Knowledge Base THIRD
  const wikiResult = await verifyWithWikipedia(sourceText);
  if (wikiResult) {
    return {
      score: 88,
      explanation: `Verified against Wikipedia Open Knowledge Graph: ${wikiResult.title} - ${wikiResult.extract.slice(0, 180)}...`,
      redFlags: [],
      trustedSources: ['Wikipedia Open Knowledge Base', 'Reuters', 'BBC'],
      educationalTips: ['Information matches open encyclopedia records. Verify breaking developments.'],
      factCheck: [],
      confidence: 88,
      timestamp: new Date().toISOString(),
    };
  }

  // 4. Heuristic & Linguistic Evaluation
  let score = 48; // Neutral baseline: unverified claims start as "REVIEW NEEDED"
  let explanation = 'The content was evaluated by Honest Eye multi-factor factual and linguistic analysis.';
  let credibilityBoost = 0;
  let riskPenalty = 0;

  // 5. Check sensational / clickbait keywords
  const fakeCount = countMatches(text, fakeIndicators);
  if (fakeCount > 0) {
    riskPenalty += fakeCount * 10;
    redFlags.push('Sensational or conspiratorial wording detected');
  }

  if (text.includes('unverified') || text.includes('rumor') || text.includes('reportedly')) {
    riskPenalty += 10;
    redFlags.push('Unverified claim language');
  }

  if (text.includes('breaking') || text.includes('must read') || text.includes('share now')) {
    riskPenalty += 10;
    redFlags.push('Clickbait-style phrasing detected');
  }

  if (text.includes('anonymous source')) {
    riskPenalty += 12;
    redFlags.push('Anonymous source warning');
  }

  // 6. Positive attribution & credible sources
  if (realCount > 0) {
    credibilityBoost += realCount * 20;
    trustedSources = ['PIB Fact Check', 'Alt News', 'BoomLive', 'Reuters', 'BBC'];
  }

  if (text.includes('study') || text.includes('research') || text.includes('peer-reviewed') || text.includes('confirmed by')) {
    credibilityBoost += 18;
    trustedSources = ['Nature', 'Reuters', 'PIB Fact Check', 'Science Daily'];
  }

  if (text.includes('fact check') || text.includes('verified by') || text.includes('official report')) {
    credibilityBoost += 15;
  }

  // 7. Domain evaluation
  if (domain) {
    if (credibleDomains.some((item) => domain.endsWith(item))) {
      credibilityBoost += 30;
      trustedSources = ['PIB Fact Check', 'Alt News', 'Reuters', 'BBC'];
      explanation = 'The source domain belongs to a recognized credible news outlet or fact-checking organization.';
    }

    if (suspiciousDomains.some((item) => domain.includes(item))) {
      riskPenalty += 30;
      redFlags.push('Suspicious domain detected');
    }
  }

  // If claim is short and completely unverified without any source attribution, flag it
  if (!realCount && !domain && text.length < 120) {
    redFlags.push('Unverified claim lacking authoritative source attribution or evidence');
  }

  score = Math.max(0, Math.min(100, score + credibilityBoost - riskPenalty));

  if (score < 40) {
    explanation = 'This content shows strong signals of misinformation or unverified claims. Exercise extreme caution before sharing.';
    if (!redFlags.length) {
      redFlags.push('Misinformation signals detected');
    }
  } else if (score >= 75) {
    explanation = 'This content appears credible and is supported by verified source indicators.';
    trustedSources = trustedSources.length ? trustedSources : ['PIB Fact Check', 'Alt News', 'Reuters', 'BBC'];
  } else {
    explanation = 'This claim has unverified credibility and requires further independent fact-checking.';
  }

  return {
    score,
    explanation,
    redFlags,
    trustedSources,
    educationalTips: [
      'Verify the claim with official sources like PIB Fact Check, Alt News, Reuters, or BBC.',
      'Check if scientific, medical, or political assertions match established facts.',
    ],
    factCheck: [],
    confidence: Math.min(100, 65 + fakeCount * 4 + realCount * 4),
    timestamp: new Date().toISOString(),
  };
}

async function analyzeWithGemini(sourceText, sourceType = 'text') {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'your_google_api_key_here') {
    return null;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const prompt = `You are Honest Eye, an AI misinformation detection assistant specialized in news credibility, fact-checking, and digital media literacy.
Today's exact real-world date is: ${currentDate} (Year ${new Date().getFullYear()}).

Evaluate the following ${sourceType} content for factual accuracy and misinformation:

"${sourceText.slice(0, 3000)}"

Temporal & Fact-Check Guidance:
- IMPORTANT: Today's date is ${currentDate}.
- Any event from past years (e.g. 2023, 2024, 2025, or earlier in ${new Date().getFullYear()}) HAS ALREADY OCCURRED in history relative to today. Do NOT claim past years or events "have not taken place yet".
- Check if the claim contradicts scientific, astronomical, medical, sports, historical, or real-world political facts.
- If the statement is false or a disproven claim, set score below 30.
- If the statement is supported by reliable evidence, set score above 75.

Return ONLY a raw JSON object (without markdown formatting or code fences) with the exact keys:
{
  "score": <number 0-100 where 100 is highly credible and 0 is fake news>,
  "explanation": "<concise explanation of factual findings with accurate temporal timeline>",
  "redFlags": ["<list of identified red flags or factual errors>"],
  "trustedSources": ["<list of credible news sources or fact-checkers>"],
  "educationalTips": ["<1-2 advice tips for verifying claims>"],
  "factCheck": [],
  "confidence": <number 0-100>
}`;

  const models = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash-lite', 'gemini-pro-latest'];

  for (const model of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) continue;

      const parsed = JSON.parse(candidateText.replace(/```json/g, '').replace(/```/g, '').trim());
      return {
        score: typeof parsed.score === 'number' ? Math.max(0, Math.min(100, parsed.score)) : 50,
        explanation: parsed.explanation || 'Analyzed via Google Gemini AI.',
        redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
        trustedSources: Array.isArray(parsed.trustedSources) ? parsed.trustedSources : ['PIB Fact Check', 'Alt News', 'Reuters', 'BBC'],
        educationalTips: Array.isArray(parsed.educationalTips) ? parsed.educationalTips : ['Verify with reliable outlets.'],
        factCheck: Array.isArray(parsed.factCheck) ? parsed.factCheck : [],
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 85,
        timestamp: new Date().toISOString()
      };
    } catch {
      continue;
    }
  }

  return null;
}

app.post('/api/misinfo', upload.single('image'), async (req, res) => {
  const { content, type } = req.body;
  const mode = type || 'text';

  try {
    if (mode === 'image') {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const ocrText = await extractImageText(req.file.buffer);
      const textToAnalyze = ocrText || req.file.originalname;
      
      let analysis = await analyzeWithGemini(textToAnalyze, 'image');
      if (!analysis) {
        analysis = await analyzeContent(textToAnalyze, 'image');
      }

      return res.json({
        ...analysis,
        content: req.file.originalname,
        type: 'image',
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    let textToAnalyze = content.trim();

    if (mode === 'url') {
      textToAnalyze = await fetchUrlContent(textToAnalyze);
    }

    let analysis = await analyzeWithGemini(textToAnalyze, mode);
    if (!analysis) {
      analysis = await analyzeContent(textToAnalyze, mode);
    }

    return res.json({
      ...analysis,
      content: content.trim(),
      type: mode,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze the content.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Honest Eye Backend running on port ${PORT}`);
});
