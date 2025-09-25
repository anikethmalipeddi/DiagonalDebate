import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"
import { rateLimiter } from "@/lib/rateLimiter"
import legislationTemplates from '@/data/legislationTemplates.json'

// IMPORTANT: Set up your API key as an environment variable
// Create a .env.local file in your project root and add:
// GEMINI_API_KEY="YOUR_API_KEY"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Helper to normalize whitespace and lowercase for case-insensitive checks
const normalize = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();

// Strict template compliance checks for Bill, Resolution, Amendment
function checkTemplateErrors(type: string, body: string, title?: string): string[] {
  const errors: string[] = [];
  const normBody = body.replace(/\s+/g, ' ').toUpperCase();

  // New: Block title in body (case-insensitive, but must be at least 8 chars)
  if (title && title.trim().length >= 8) {
    const normTitle = title.replace(/\s+/g, ' ').trim().toLowerCase();
    const normBodyLower = body.replace(/\s+/g, ' ').toLowerCase();
    if (normBodyLower.includes(normTitle)) {
      errors.push("Do not type or paste your legislation's title in the body text. Only include the body of your legislation here.");
    }
  }

  if (type === 'bill') {
    // Required sections in order
    const requiredSections = [
      'SECTION 1.',
      'SECTION 2.',
      'SECTION 3.',
      'SECTION 4.',
      'SECTION 5.',
      'SECTION 6.'
    ];
    // Find all section headers and their order (case sensitive)
    const sectionRegex = /SECTION \d+\./g;
    const foundSections = [];
    let match;
    while ((match = sectionRegex.exec(body)) !== null) {
      foundSections.push(match[0]); // do not uppercase
    }
    // Check for missing or out-of-order sections (case sensitive)
    for (let i = 0; i < requiredSections.length; i++) {
      if (foundSections[i] !== requiredSections[i]) {
        // Check if a lower/mixed case version exists
        const regexLoose = new RegExp(requiredSections[i].replace('.', '\.'), 'i');
        const looseMatch = body.match(regexLoose);
        if (looseMatch) {
          errors.push(`Section header '${looseMatch[0]}' is not in the correct format. Use '${requiredSections[i]}' (all caps, with a period).`);
        } else {
          errors.push(`Missing or out-of-order: ${requiredSections[i]}`);
        }
      }
    }
    // --- LOGGING FOR DEBUG ---
    console.log('--- TEMPLATE CHECK DEBUG ---');
    console.log('Raw body:', JSON.stringify(body));
    // Check SECTION 5 content (case sensitive)
    const section5Match = body.match(/SECTION 5\.[\s\S]*?(?=SECTION 6\.|$)/);
    console.log('SECTION 5 match:', section5Match);
    let section5Text = '';
    if (section5Match) {
      section5Text = section5Match[0];
      console.log('SECTION 5 text:', section5Text);
      const datePattern = /(FY \d{4}|Fiscal Year \d{4}|[A-Z][a-z]+ \d{1,2}(?:st|nd|rd|th)?, \d{4})/i;
      const immediatePattern = /IMMEDIATELY UPON ITS PASSAGE/i;
      if (!datePattern.test(section5Text) && !immediatePattern.test(section5Text)) {
        errors.push('SECTION 5 must include a date (e.g., "FY 2024", "Fiscal Year 2024", "July 1, 2024", or "July 1st, 2024") or the phrase "immediately upon its passage".');
      }
    } else {
      errors.push('Missing SECTION 5 content.');
    }
    // Check SECTION 6 nullification (case sensitive)
    const section6Match = body.match(/SECTION 6\.[\s\S]*/);
    console.log('SECTION 6 match:', section6Match);
    if (section6Match) {
      const section6Text = section6Match[0];
      console.log('SECTION 6 text:', section6Text);
      if (!section6Text.includes('All laws in conflict with this legislation are hereby declared null and void.')) {
        errors.push('SECTION 6 must include: "All laws in conflict with this legislation are hereby declared null and void."');
      }
    } else {
      errors.push('Missing SECTION 6 content.');
    }
    console.log('--- END TEMPLATE CHECK DEBUG ---');
  } else if (type === 'resolution') {
    // At least one WHEREAS, clause (case sensitive)
    const whereasRegex = /WHEREAS,.*?;/g;
    const allWhereas = [];
    let match;
    while ((match = whereasRegex.exec(body)) !== null) {
      allWhereas.push(match[0]);
    }
    if (allWhereas.length < 1) {
      // Check for lowercase/mixed-case version
      const looseWhereas = body.match(/whereas,.*?;/i);
      if (looseWhereas) {
        errors.push(`Clause '${looseWhereas[0]}' is not in the correct format. Use 'WHEREAS,' (all caps, with a comma).`);
      } else {
        errors.push('At least one WHEREAS, clause is required.');
      }
    }
    // Final WHEREAS must end with '; now, therefore, be it' (case sensitive)
    const finalWhereasPattern = /WHEREAS,.*?; now, therefore, be it/;
    if (!finalWhereasPattern.test(body)) {
      // Check for lowercase/mixed-case version
      const looseFinal = body.match(/whereas,.*?; now, therefore, be it/i);
      if (looseFinal) {
        errors.push(`Final WHEREAS clause '${looseFinal[0]}' is not in the correct format. Use all caps and exact punctuation: '; now, therefore, be it'.`);
      } else {
        errors.push('The final WHEREAS, clause must end with "; now, therefore, be it".');
      }
    }
    // RESOLVED clause (case sensitive)
    if (!/RESOLVED, That the Congress here assembled/.test(body)) {
      const looseResolved = body.match(/resolved, that the congress here assembled/i);
      if (looseResolved) {
        errors.push(`Clause '${looseResolved[0]}' is not in the correct format. Use 'RESOLVED, That the Congress here assembled' (all caps for RESOLVED, exact case for rest).`);
      } else {
        errors.push('Missing required RESOLVED, That the Congress here assembled clause.');
      }
    }
    // WHEREAS must come before RESOLVED (case sensitive)
    const firstWhereas = body.search(/WHEREAS,/);
    const firstResolved = body.search(/RESOLVED,/);
    if (firstResolved !== -1 && (firstWhereas === -1 || firstWhereas > firstResolved)) {
      errors.push('All WHEREAS, clauses must come before any RESOLVED, clause.');
    }
  } else if (type === 'amendment') {
    // Strict RESOLVED clause (case sensitive)
    const resolvedPattern = /RESOLVED, By two-thirds of the Congress here assembled, that the following article is proposed as an amendment to the Constitution of the United States, which shall be valid to all intents and purposes as part of the Constitution when ratified by the legislatures of three-fourths of the several states within seven years from the date of its submission by the Congress:/;
    if (!resolvedPattern.test(body)) {
      const looseResolved = body.match(/resolved, by two-thirds of the congress here assembled, that the following article is proposed as an amendment to the constitution of the united states, which shall be valid to all intents and purposes as part of the constitution when ratified by the legislatures of three-fourths of the several states within seven years from the date of its submission by the congress:/i);
      if (looseResolved) {
        errors.push(`RESOLVED clause is not in the correct format. Use exact case and punctuation as required.`);
      } else {
        errors.push('Missing or incorrect RESOLVED clause for amendment.');
      }
    }
    // ARTICLE -- (case sensitive)
    if (!/ARTICLE --/.test(body)) {
      const looseArticle = body.match(/article --/i);
      if (looseArticle) {
        errors.push(`ARTICLE header '${looseArticle[0]}' is not in the correct format. Use 'ARTICLE --' (all caps, two hyphens).`);
      } else {
        errors.push('Missing ARTICLE -- header.');
      }
    }
    // SECTION 1: and SECTION 2: in order (accept colon or period, but prefer colon)
    const section1ColonIndex = body.search(/SECTION 1:/);
    const section1PeriodIndex = body.search(/SECTION 1\./);
    const section2ColonIndex = body.search(/SECTION 2:/);
    const section2PeriodIndex = body.search(/SECTION 2\./);
    let section1Index = -1;
    let section2Index = -1;
    if (section1ColonIndex !== -1) {
      section1Index = section1ColonIndex;
    } else if (section1PeriodIndex !== -1) {
      section1Index = section1PeriodIndex;
      errors.push("Section header 'SECTION 1.' is not in the correct format. Use 'SECTION 1:' (all caps, with a colon).")
    } else {
      const looseSec1 = body.match(/section 1[:.]/i);
      if (looseSec1) {
        errors.push(`Section header '${looseSec1[0]}' is not in the correct format. Use 'SECTION 1:' (all caps, with a colon).`);
      } else {
        errors.push('Missing SECTION 1:');
      }
    }
    if (section2ColonIndex !== -1) {
      section2Index = section2ColonIndex;
    } else if (section2PeriodIndex !== -1) {
      section2Index = section2PeriodIndex;
      errors.push("Section header 'SECTION 2.' is not in the correct format. Use 'SECTION 2:' (all caps, with a colon).")
    } else {
      const looseSec2 = body.match(/section 2[:.]/i);
      if (looseSec2) {
        errors.push(`Section header '${looseSec2[0]}' is not in the correct format. Use 'SECTION 2:' (all caps, with a colon).`);
      } else {
        errors.push('Missing SECTION 2:');
      }
    }
    if (section1Index !== -1 && section2Index !== -1 && section1Index > section2Index) {
      errors.push('SECTION 1: must come before SECTION 2:');
    }
    // SECTION 2 enforcement phrase (case sensitive, works for either colon or period)
    let section2Match = body.match(/SECTION 2:(.*)/);
    if (!section2Match) {
      section2Match = body.match(/SECTION 2\.(.*)/);
    }
    if (section2Match) {
      const section2Text = section2Match[1];
      if (!section2Text.includes('The Congress shall have power to enforce this article by appropriate legislation.')) {
        const looseEnforce = section2Text.match(/the congress shall have power to enforce this article by appropriate legislation\.?/i);
        if (looseEnforce) {
          errors.push('Enforcement phrase in SECTION 2 is not in the correct format. Use exact case and punctuation.');
        } else {
          errors.push('SECTION 2 must include "The Congress shall have power to enforce this article by appropriate legislation."');
        }
      }
    } else {
      errors.push('Missing SECTION 2 content.');
    }
  }
  return errors;
}

// Helper: Split body into sections for grammar/spellcheck
function splitIntoSections(type: string, body: string): { section: string, text: string }[] {
  if (type === 'bill' || type === 'amendment') {
    // Match SECTION X. or SECTION X:
    const regex = /(SECTION \d+[.:])([\s\S]*?)(?=SECTION \d+[.:]|$)/g;
    const sections = [];
    let match;
    while ((match = regex.exec(body)) !== null) {
      sections.push({ section: match[1].trim(), text: match[2].trim() });
    }
    return sections;
  } else if (type === 'resolution') {
    // Split by WHEREAS, and RESOLVED, clauses
    const regex = /(WHEREAS,|RESOLVED,|FURTHER RESOLVED,)([\s\S]*?)(?=WHEREAS,|RESOLVED,|FURTHER RESOLVED,|$)/g;
    const sections = [];
    let match;
    while ((match = regex.exec(body)) !== null) {
      sections.push({ section: match[1].trim(), text: match[2].trim() });
    }
    return sections;
  }
  return [{ section: 'Body', text: body }];
}

// Helper: Call LanguageTool API for spelling/grammar
// Only check spelling by disabling all non-spelling rules
async function checkSpellingOnly(text: string): Promise<any[]> {
  // Only disable categories unrelated to spelling; leave TYPOS enabled
  const params = new URLSearchParams();
  params.append('text', text);
  params.append('language', 'en-US');
  params.append('enabledOnly', 'false');
  // Do NOT disable TYPOS; this is where spelling errors are reported
  params.append('disabledCategories', 'GRAMMAR,STYLE,PUNCTUATION,CASING,CONFUSED_WORDS,REDUNDANCY,SEMANTICS,CLARITY,COMPOUNDING,NONSTANDARD_PHRASES,INCONSISTENCY,INFORMATION,TYPOGRAPHY,WHITESPACE,WORDINESS,NUMBERS,REGEX,OTHER');
  const res = await fetch('https://api.languagetool.org/v2/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.matches || [];
}

// Helper: Call LanguageTool API for full grammar check (all rules enabled)
async function checkGrammarFull(text: string): Promise<any[]> {
  const params = new URLSearchParams();
  params.append('text', text);
  params.append('language', 'en-US');
  params.append('enabledOnly', 'false');
  // Do NOT disable any categories; check all grammar, style, spelling, etc.
  const res = await fetch('https://api.languagetool.org/v2/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.matches || [];
}

export async function POST(req: NextRequest) {
  try {
    console.log('[API] Received legislation check request');
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    try {
      await rateLimiter(ip as string);
    } catch {
      console.error('[API] Rate limit exceeded for IP:', ip);
      return NextResponse.json({
        error: "Rate limit exceeded.",
        message: "You have made too many requests. The limit is 5 requests per minute. Please wait a minute and try again. This protects our free AI resources for everyone."
      }, { status: 429 });
    }
    const { text, type, category, number, title } = await req.json()
    console.log('[API] Request body:', { text, type, category, number, title });

    if (!text || !type || !category || !number || !title) {
      console.error('[API] Missing required form fields', { text, type, category, number, title });
      return NextResponse.json({ error: "Missing required form fields" }, { status: 400 })
    }

    // Perform the simple, rule-based template checks first
    const templateErrors = checkTemplateErrors(type, text, title)
    console.log('[API] Template errors:', templateErrors);

    // Spelling check (strict spelling only)
    let spellingMatches = [];
    try {
      spellingMatches = await checkSpellingOnly(text);
      console.log('[API] LanguageTool spelling matches:', spellingMatches);
    } catch (err) {
      console.error('[API] LanguageTool spelling error:', err);
    }
    // Common government, business, and debate acronyms that should be ignored
    const allowedAcronyms = [
      // Government Agencies & Departments
      'USTR', 'CBP', 'HHS', 'FDA', 'EPA', 'DOD', 'DOE', 'DOJ', 'DHS', 'USDA',
      'NASA', 'NOAA', 'OSHA', 'FEMA', 'CIA', 'FBI', 'NSA', 'IRS', 'SSA',
      'ATF', 'DEA', 'ICE', 'TSA', 'USCIS', 'USPS', 'VA', 'CMS', 'CDC',
      'NIH', 'NIST', 'CPSC', 'FTC', 'SEC', 'CFTC', 'FDIC', 'OCC', 'NCUA',
      'SBA', 'GSA', 'OPM', 'OMB', 'CBO', 'GAO', 'USAID', 'ODNI', 'DNI',

      // Legislative & Political
      'GOP', 'DNC', 'RNC', 'PAC', 'SCOTUS', 'POTUS', 'VPOTUS', 'FLOTUS',
      'SOTU', 'NDAA', 'AUMF', 'CRA', 'FOIA', 'ACA', 'DACA', 'DREAM',

      // International Organizations
      'UN', 'NATO', 'EU', 'WHO', 'IMF', 'WTO', 'OECD', 'G7', 'G20',
      'ASEAN', 'OPEC', 'BRICS', 'NAFTA', 'USMCA', 'TPP', 'CPTPP',

      // Business & Economics
      'CEO', 'CFO', 'CTO', 'COO', 'CMO', 'CIO', 'IPO', 'LLC', 'Inc',
      'GDP', 'GNP', 'CPI', 'PPI', 'NYSE', 'NASDAQ', 'S&P', 'DOW',
      'REIT', 'ETF', 'ESG', 'ROI', 'NPV', 'IRR', 'EBITDA', 'P&L',

      // Technology & Internet
      'AI', 'ML', 'IoT', 'VR', 'AR', 'API', 'URL', 'HTTP', 'HTTPS',
      'DNS', 'ISP', 'WiFi', 'GPS', 'USB', 'CPU', 'GPU', 'RAM', 'SSD',
      'IT', 'IP', 'TCP', 'UDP', 'SSL', 'TLS', 'VPN', 'CDN', 'SaaS',

      // Education & Academic
      'GPA', 'SAT', 'ACT', 'AP', 'IB', 'STEM', 'STEAM', 'PhD', 'MBA',
      'BA', 'BS', 'MA', 'MS', 'MD', 'JD', 'LLM', 'EdD', 'PsyD',

      // Healthcare & Medical
      'EMT', 'ICU', 'ER', 'OR', 'MRI', 'CT', 'EKG', 'ECG', 'IV',
      'CPR', 'AED', 'HIPAA', 'PPE', 'WHO', 'AMA', 'RN', 'LPN', 'PA',

      // Military & Defense
      'NATO', 'NORAD', 'CENTCOM', 'PACOM', 'EUCOM', 'AFRICOM', 'SOUTHCOM',
      'JSOC', 'SOCOM', 'STRATCOM', 'CYBERCOM', 'TRANSCOM', 'SPACECOM',
      'USMC', 'USCG', 'USSF', 'ROTC', 'JROTC', 'POW', 'MIA', 'KIA',

      // Environmental & Energy
      'CO2', 'CH4', 'N2O', 'CFC', 'HFC', 'PFC', 'SF6', 'GHG', 'PPM',
      'EPA', 'NEPA', 'ESA', 'CWA', 'CAA', 'RCRA', 'CERCLA', 'TSCA',

      // Debate & Forensics
      'NSDA', 'WACFL', 'NCFL', 'PF', 'LD', 'CX', 'VHSL', 'TOC', 'NDCA',
      'NFL', 'NIETOC', 'NAUDL', 'APDA', 'NPDA', 'CEDA', 'NDT', 'NPTE',

      // Common Abbreviations
      'USA', 'US', 'UK', 'EU', 'USSR', 'UAE', 'UAE', 'PRC', 'ROC',
      'DPRK', 'ROK', 'ASAP', 'FAQ', 'FYI', 'RSVP', 'TBD', 'TBA',
      'ETA', 'EOD', 'COB', 'QA', 'R&D', 'HR', 'PR', 'IT', 'AI'
    ];

    let grammarSpellingErrors = [];
    for (const match of spellingMatches) {
      // Get the flagged word from the text
      const flaggedWord = text.substring(match.offset, match.offset + match.length);
      console.log('[API] Checking flagged word:', flaggedWord, 'against allowed acronyms');

      // Skip if it's a known acronym
      if (allowedAcronyms.includes(flaggedWord.toUpperCase())) {
        console.log('[API] Skipping allowed acronym:', flaggedWord);
        continue;
      }

      grammarSpellingErrors.push({
        section: 'Body',
        message: match.message,
        offset: match.offset,
        length: match.length,
        context: match.context,
        replacements: match.replacements,
        rule: match.rule,
        type: match.rule.issueType
      });
    }
    if (grammarSpellingErrors.length >= 30) {
      grammarSpellingErrors.push({
        section: 'Body',
        message: 'Warning: Only the first 30 misspelled words are shown due to API limits. Please correct these and recheck.',
        offset: 0,
        length: 0,
        context: '',
        replacements: [],
        rule: { id: 'TOO_MANY_ERRORS', description: 'API limit' },
        type: 'other',
      });
    }
    // Full grammar check (all rules enabled)
    let grammarErrors: any[] = [];
    try {
      const grammarMatches = await checkGrammarFull(text);
      grammarErrors = grammarMatches.filter(match => {
        // Apply same acronym filter to grammar check
        const flaggedWord = text.substring(match.offset, match.offset + match.length);
        return !allowedAcronyms.includes(flaggedWord.toUpperCase());
      }).map(match => ({
        section: 'Body',
        message: match.message,
        offset: match.offset,
        length: match.length,
        context: match.context,
        replacements: match.replacements,
        rule: match.rule,
        type: match.rule.issueType
      }));
      console.log('[API] LanguageTool grammar matches:', grammarErrors);
    } catch (err) {
      console.error('[API] LanguageTool grammar error:', err);
    }

    // If there are any template or spelling errors, skip Gemini/AI review and readability
    if (templateErrors.length > 0 || grammarSpellingErrors.length > 0) {
      const feedback = {
        templateErrors,
        grammarSpellingErrors,
        grammar: grammarErrors,
        readability: { score: 0, suggestions: [] },
        aiSuggestions: [],
        isSubmittable: false,
        overallScore: 0,
        grammarSpellingRateLimited: false,
        aiReviewError: null,
      };
      console.log('[API] Final feedback object (errors present, skipping AI):', feedback);
      return NextResponse.json(feedback);
    }

    // Gemini API call
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })
    const prompt = `
      You are an expert debate coach specializing in high school Congressional Debate.
      Your task is to review a piece of legislation and provide feedback in four specific categories: Grammar, Readability, AI Suggestions, and an Overall Score using a detailed rubric.
      The legislation text is provided below.

      IMPORTANT GUIDELINES:
      - Legislation is never going to be perfect - be reasonable and constructive
      - Do NOT mark names (people, places, organizations) as grammar errors
      - Allow submission when the overall quality score is above 80
      - Focus on structural issues and clarity, not minor formatting preferences
      - Be encouraging while still providing helpful feedback

      Legislation Text:
      ---
      ${text}
      ---

      **Legislation Evaluation Rubric (Grammar Now Explicitly Weighted)**

      Score each bill, resolution, or amendment from 0 to 100. A score of 80 or higher means the draft is *complete and fully functional*; anything below 80 is too incomplete or flawed for debate without significant revision. Judge five core dimensions—**structure/completeness, clarity of purpose, professional tone, detail/realism, and grammar**—with grammar now treated as a stand-alone factor that can raise or lower a piece within any band. Use the 1's digit (e.g., 83 vs. 84) to capture your gut sense of polish or shakiness inside a band.

      **95–100 (Elite)**
      Reads like a finished congressional submission. Structure is flawless, argument flow is smooth, all key terms are defined, and enforcement/implementation details are specific and realistic. Grammar and mechanics are virtually perfect—no dangling modifiers, tense shifts, or punctuation slip-ups. A 100 is reserved for the rare draft that feels publish-ready.

      **90–94 (Excellent)**
      Fully structured and professional with strong detail and logical enforcement provisions. Language is concise and largely free of filler. Grammar errors are rare, isolated, and never impede comprehension (e.g., one missed article or a stray comma splice). Minor refinements could push it into the top tier.

      **85–89 (Very Good)**
      Solid, debate-ready legislation. All mandatory sections are present, and the intent is clear, but some clauses rely on generic wording or assume background knowledge. Grammar is overall correct, yet you may spot occasional subject-verb mismatch, missing serial comma, or awkward phrasing that momentarily slows the reader. Still clearly functional.

      **80–84 (Bare-Minimum Passing)**
      Complete and coherent—but shows signs of haste. Key ideas are stated, but feasibility analysis or definitions are thin. Grammar issues become noticeable: multiple run-ons, agreement slips, or inconsistent capitalization of defined terms. These drafts work in a pinch but need editing for smoother delivery and stronger credibility.

      **70–79 (Incomplete)**
      Missing at least one critical element—timeline, enforcement clause, or proper formatting—or the wording is unclear enough to raise feasibility doubts. Grammar problems are frequent (e.g., unclear pronoun references, comma splices, tense switching), further muddying intent. Substantial rewriting required.

      **60–69 (Fundamentally Flawed)**
      Structure is patchy or mis-ordered, logic may contradict itself, and many sentences are grammatically broken or ambiguous. Readers struggle to follow who does what or why. Cannot enter debate until overhauled.

      **Below 60 (Unusable)**
      Little resemblance to formal legislation. Sections are missing or mislabeled, ideas are fragmentary, and grammar lapses render passages incomprehensible. Reject outright.

      **Guidance on the 1's Digit**
      Within any band, let grammar finesse (or lack thereof), stylistic smoothness, and overall confidence dictate the final single-digit nudge:

      * A higher digit (e.g., 87 → 89) indicates the draft *almost* reaches the next tier in grammar and flow.
      * A lower digit (e.g., 87 → 85) signals persistent grammatical roughness or clunky turns of phrase that keep it firmly in its current band.

      Apply this rubric consistently so your AI (or human reviewers) rewards drafts that marry airtight structure with clean, professional grammar—hallmarks of legislation that commands respect on the debate floor.

      Please provide your feedback in a structured JSON format. The output MUST be a valid JSON object with the following keys: "grammar", "readability", "aiSuggestions", "overallScore", and "isSubmittable".
      - "grammar": An array of strings, where each string is a specific grammar, spelling, or punctuation suggestion. Be thorough and catch ALL grammar issues including: articles ("a" vs "an"), subject-verb agreement, tense consistency, pronoun agreement, parallel structure, comma usage, capitalization of defined terms, run-on sentences, sentence fragments, and any other grammar conventions that would make legislation look unprofessional. DO NOT flag names (people, places, organizations) as errors. If there are no significant errors, return an empty array.
      - "readability": An object with two keys: "score" (a Flesch Reading Ease score from 0 to 100, where 100 is most readable) and "suggestions" (an array of strings with specific advice to improve clarity and readability). Calculate the Flesch Reading Ease score using the formula: 206.835 - (1.015 × average sentence length) - (84.6 × average syllables per word).
      - "aiSuggestions": An array of strings containing higher-level feedback. Focus on improving the argument's strength, identifying logical fallacies, suggesting better evidence, or pointing out structural weaknesses. If the legislation is well-written and effective, this array should contain positive reinforcement and praise for its strengths.
      - "overallScore": A number from 0 to 100 based on the detailed rubric above. This should reflect the overall quality considering structure/completeness, clarity of purpose, professional tone, detail/realism, and grammar.
      - "isSubmittable": A boolean value. Set to true if the overallScore is 80 or higher, indicating the legislation is complete and fully functional for debate.

      Example of a reasonable response format:
      {
        "grammar": [],
        "readability": {
          "score": 65,
          "suggestions": [
            "Consider breaking down complex sentences in paragraph 2 for better clarity."
          ]
        },
        "aiSuggestions": [
          "Section 2 is present but could be more specific about implementation details.",
          "A sunset clause could make the legislation more palatable to opponents."
        ],
        "overallScore": 87,
        "isSubmittable": true
      }

      Now, analyze the provided legislation text and return only the JSON object.
    `
    console.log('[API] Calling Gemini API...');
    let aiResponseText = '';
    let aiFeedback = null;
    let geminiError = null;
    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      aiResponseText = await response.text()
      console.log('[API] Gemini raw response:', aiResponseText);
      // Clean the response to ensure it's valid JSON
      const cleanedJsonText = aiResponseText.replace(/^```json\s*|```\s*$/g, "")
      aiFeedback = JSON.parse(cleanedJsonText)
      console.log('[API] Gemini parsed feedback:', aiFeedback);
    } catch (err) {
      geminiError = err;
      // Check for overload/503
      const errMsg = (err instanceof Error ? err.message : String(err)).toLowerCase();
      if (errMsg.includes('503') || errMsg.includes('overloaded')) {
        geminiError = 'AI review service is temporarily overloaded. Please try again in a few minutes.';
      } else {
        geminiError = 'AI review service is temporarily unavailable.';
      }
      console.error('[API] Gemini API or JSON parse error:', err);
    }

    // Combine rule-based errors with AI feedback
    const finalFeedback = {
      templateErrors,
      grammarSpellingErrors,
      grammar: grammarErrors,
      readability: aiFeedback?.readability || { score: 0, suggestions: [] },
      aiSuggestions: aiFeedback?.aiSuggestions || [],
      isSubmittable: aiFeedback?.isSubmittable || false, // isSubmittable: only if no template errors and no spelling errors
      overallScore: aiFeedback?.overallScore || 0,
      grammarSpellingRateLimited: false,
      aiReviewError: geminiError,
    }
    console.log('[API] Final feedback object:', finalFeedback);

    return NextResponse.json(finalFeedback)
  } catch (error) {
    console.error('[API] Error processing legislation:', error);
    if (error instanceof Error && error.stack) {
      console.error('[API] Stack trace:', error.stack);
    }
    return NextResponse.json({ error: "Failed to process legislation" }, { status: 500 })
  }
} 