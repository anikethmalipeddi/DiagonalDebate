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

// A simple in-memory check for required clauses based on legislation type
const checkTemplateErrors = (text: string, type: 'bill' | 'resolution' | 'amendment', category: string, number: string, title: string) => {
  const errors: string[] = []
  
  // Bill template enforcement
  if (type === "bill") {
    const template = legislationTemplates.bill
    if (template.titlePattern && !normalize(title).startsWith(normalize(template.titlePattern))) {
      errors.push(`Title must start with: '${template.titlePattern}'. Your title: '${title.trim()}'`)
    }
    if (!/section 1\./i.test(text)) {
      errors.push('A bill must include "SECTION 1." as the first section.')
    }
    for (const section of template.requiredSections) {
      if (section.required && !normalize(text).includes(normalize(section.header))) {
        errors.push(`Missing required section: '${section.header}'`)
      }
    }
  }

  // Resolution template enforcement
  if (type === "resolution") {
    const template = legislationTemplates.resolution
    if (template.titlePattern && !normalize(title).startsWith(normalize(template.titlePattern))) {
      errors.push(`Title must start with: '${template.titlePattern}'. Your title: '${title.trim()}'`)
    }
    const whereasCount = (text.match(/WHEREAS,/gi) || []).length
    if (whereasCount < 1) {
      errors.push('A resolution must include at least one "WHEREAS," clause.')
    }
    if (!/RESOLVED,/i.test(text)) {
      errors.push('A resolution must include at least one "RESOLVED," clause.')
    }
  }

  // Amendment template enforcement
  if (type === "amendment") {
    const template = legislationTemplates.amendment
    if (template.titlePattern && !normalize(title).startsWith(normalize(template.titlePattern))) {
      errors.push(`Title must start with: '${template.titlePattern}'. Your title: '${title.trim()}'`)
    }
    if (!normalize(text).includes(normalize(template.resolvedClause))) {
      errors.push(`Missing resolved clause: '${template.resolvedClause}'`)
    }
    if (!normalize(text).includes(normalize(template.articleHeader))) {
      errors.push(`Missing article header: '${template.articleHeader}'`)
    }
    if (!/section 1:/i.test(text)) {
      errors.push('An amendment must include "SECTION 1:" as the first section.')
    }
    for (const section of template.requiredSections) {
      if (section.required && !normalize(text).includes(normalize(section.header))) {
        errors.push(`Missing required section: '${section.header}'`)
      }
    }
  }

  // Number prefix check (as before)
  if (category && number) {
    const numberParts = number.trim().split(/[^a-zA-Z0-9.]+/)
    const idPart = numberParts[numberParts.length - 1]
    if (idPart) {
      const numberPrefix = idPart.charAt(0).toLowerCase()
      const categoryPrefix = category.charAt(0).toLowerCase()
      if (numberPrefix !== categoryPrefix) {
        errors.push(
          `Legislation number prefix '${idPart.charAt(0).toUpperCase()}' does not match the category '${category.charAt(0).toUpperCase() + category.slice(1)}'. The prefix should be '${category.charAt(0).toUpperCase()}'.`
        )
      }
    }
  }

  return errors
}

async function checkGrammarSpelling(text: string) {
  const res = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      text,
      language: "en-US",
    }),
  })
  if (res.status === 429) return { errors: [], rateLimited: true };
  if (!res.ok) return { errors: [], rateLimited: false };
  const data = await res.json();
  return {
    errors: (data.matches || []).map((match: any) => {
      return {
        message: match.message || "",
        context: match.context?.text || "",
        offset: match.context?.offset || 0,
        length: match.context?.length || 0,
        replacements: (match.replacements || []).map((r: any) => r.value || ""),
        rule: match.rule?.description || ""
      }
    }),
    rateLimited: false
  };
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    try {
      await rateLimiter(ip as string);
    } catch {
      return NextResponse.json({
        error: "Rate limit exceeded.",
        message: "You have made too many requests. The limit is 5 requests per minute. Please wait a minute and try again. This protects our free AI resources for everyone."
      }, { status: 429 });
    }
    const { text, type, category, number, title } = await req.json()

    if (!text || !type || !category || !number || !title) {
      return NextResponse.json({ error: "Missing required form fields" }, { status: 400 })
    }

    // Perform the simple, rule-based template checks first
    const templateErrors = checkTemplateErrors(text, type, category, number, title)

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

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

    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponseText = response.text()

    // Clean the response to ensure it's valid JSON
    const cleanedJsonText = aiResponseText.replace(/^```json\s*|```\s*$/g, "")
    const aiFeedback = JSON.parse(cleanedJsonText)

    // Combine rule-based errors with AI feedback
    const finalFeedback = {
      templateErrors,
      grammarSpellingErrors: [], // Empty array since we removed LanguageTool
      ...aiFeedback,
    }

    return NextResponse.json(finalFeedback)
  } catch (error) {
    console.error("Error processing legislation:", error)
    return NextResponse.json({ error: "Failed to process legislation" }, { status: 500 })
  }
} 