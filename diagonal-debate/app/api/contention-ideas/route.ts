import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { rateLimiter } from "@/lib/rateLimiter"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  try {
    await rateLimiter(ip as string);
  } catch {
    return NextResponse.json({
      error: "Rate limit exceeded.",
      message: "You have made too many requests. The limit is 5 requests per minute. Please wait a minute and try again. This protects our free AI resources for everyone."
    }, { status: 429 });
  }
  try {
    const { topic, side, summary, tags, single, index } = await req.json()
    if (!topic || !side) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    // Use summary if provided and long enough, else use topic as the bill summary
    const billSummary = summary && typeof summary === 'string' && summary.trim().length >= 10 ? summary : topic

    // New XML-style prompt
    const prompt = `r
<task_overview>
    <side>${side === "pro" ? "Pro" : "Con"}
    </side>
    <legislation_summary>
        ${billSummary}
    </legislation_summary>

    <purpose>
        The contentions will be copied into a brief and refined into a full
        Congress speech; they must therefore be stand-alone, evidence-ready,
        and genuinely novel.
    </purpose>

    <success_criteria>
        <criterion>Every contention is factually plausible and clearly tied to the bill.</criterion>
        <criterion>Each link-warrant-impact chain is unique enough that a typical Congress round is unlikely to repeat it.</criterion>
        <criterion>Arguments must be clear, direct, and specific to the bill.</criterion>
        <criterion>For the Pro side: Only give direct, positive reasons why the bill is good. Each contention should start with a clear, one-sentence statement: 'This bill is good because...'. Each contention must state exactly why the bill is good and what positive impact it will have. Do not just restate the bill's provisions—explain the real-world benefit.</criterion>
        <criterion>For the Con side: Only give direct, negative reasons why the bill is bad. Do NOT argue that the bill is bad just because it 'doesn't go far enough' or 'could be better,' unless the bill is actually net negative. If the bill is a net positive, do not use 'not enough' or 'could be better' as a con argument. Each contention should start with a clear, one-sentence statement: 'This bill is bad because...'</criterion>
    </success_criteria>

    <format>
        Return ONLY a JSON array of 3 objects. Each object must have these fields:
        - "contention": (string) The main argument, as a single, clear sentence. For Pro: 'This bill is good because...'. For Con: 'This bill is bad because...'.
        - "link": (string) The logical connection to the bill.
        - "warrant": (string) The evidence or reasoning.
        - "impact": (string) The real-world consequence.
    </format>

    <example>
        [
          {
            "contention": "This bill is good because it increases access to palliative care, resulting in improved quality of life for terminally ill patients.",
            "link": "Section 1 expands funding for palliative care programs.",
            "warrant": "Studies show that increased access to palliative care reduces patient suffering and hospital readmissions.",
            "impact": "Terminally ill patients experience less pain and greater dignity at the end of life."
          },
          {
            "contention": "This bill is good because it provides terminally ill patients with greater control over their final moments, resulting in reduced suffering and anxiety.",
            "link": "Section 1 legalizes assisted euthanasia for terminally ill patients with less than six months to live.",
            "warrant": "Numerous studies show a strong correlation between patient autonomy and improved end-of-life experience, reducing suffering and anxiety.",
            "impact": "Improved quality of life and reduced suffering for terminally ill individuals who choose this option."
          },
          {
            "contention": "This bill is bad because it creates a risk of increased healthcare fraud due to expanded Medicare/Medicaid coverage.",
            "link": "Section 5 mandates full coverage for assisted euthanasia.",
            "warrant": "Expanding coverage without robust oversight has led to fraud in other programs.",
            "impact": "Taxpayer money may be wasted and public trust eroded."
          },
          {
            "contention": "This bill is bad because it may lead to unequal access for rural patients due to registry implementation challenges.",
            "link": "Section 3 requires a national registry of providers, but does not address rural access.",
            "warrant": "Registries often fail to serve rural areas without specific provisions.",
            "impact": "Rural patients may be denied access, leading to inequity."
          }
        ]
        // BAD EXAMPLE (do NOT do this for con):
        // { "contention": "This bill is bad because it doesn't go far enough to address all end-of-life issues." }
    </example>

    <instructions>
        Do NOT include any arguments that the bill is bad just because it could be better or doesn't go far enough, unless the bill is actually net negative. Focus on real, direct negative impacts for con, and real, direct positive impacts for pro.
    </instructions>
</task_overview>
`

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()

    console.log("[Gemini RAW RESPONSE]", text)

    let contentions: any = []
    let fallback = false
    let extractionError = null

    // Try to extract JSON from code block if present
    let jsonText = text
    const codeBlockMatch = text.match(/```json\s*([\s\S]*?)```/i)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    } else {
      // Try <answer>...</answer> extraction as before
      const answerMatch = text.match(/<answer>([\s\S]*?)<\/answer>/)
      if (answerMatch) {
        jsonText = answerMatch[1].trim()
      }
    }

    try {
      contentions = JSON.parse(jsonText)
      if (!Array.isArray(contentions) || typeof contentions[0] !== 'object') {
        throw new Error('Extracted JSON is not an array of objects')
      }
    } catch (err) {
      extractionError = err
      // fallback: split by lines or numbers
      contentions = text
        .split(/\n+/)
        .map((line) => line.replace(/^\d+\.?\s*/, "").trim())
        .filter(Boolean)
      fallback = true
    }

    // Only return up to 3
    if (single && typeof index === 'number' && Array.isArray(contentions)) {
      return NextResponse.json({
        contention: contentions[index] || null,
        fallback,
        extractionError: extractionError ? extractionError.toString() : undefined,
        raw: text,
      })
    } else {
      return NextResponse.json({
        contentions: contentions.slice(0, 3),
        fallback,
        extractionError: extractionError ? extractionError.toString() : undefined,
        raw: text,
      })
    }
  } catch (error: any) {
    console.error("Error generating AI contentions:", error)
    return NextResponse.json({ error: error?.message || "Failed to generate contentions" }, { status: 500 })
  }
} 