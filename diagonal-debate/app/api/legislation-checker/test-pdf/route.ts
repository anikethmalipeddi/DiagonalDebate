import { NextRequest, NextResponse } from 'next/server'
import { generateLegislationPDF } from '../submit/route'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  // Test data for the amendment to lower the federal voting age
  const type = 'amendment'
  const category = 'domestic'
  const number = 'D411'
  const title = 'A Resolution to Amend the Constitution to Lower the Federal Voting Age'
  const content = `RESOLVED, By two-thirds of the Congress here assembled, that the following article is proposed as an amendment to the Constitution of the United States, which shall be valid to all intents and purposes as part of the Constitution when ratified by the legislatures of three-fourths of the several states within seven years from the date of its submission by the Congress:

ARTICLE --
SECTION 1. The right of citizens of the United States, who are sixteen years of age or older, to vote in federal elections shall not be denied or abridged by the United States or by any State on account of age.
SECTION 2. The Congress shall have power to enforce this article by appropriate legislation.`

  // Generate the PDF buffer
  const doc = await generateLegislationPDF(type, category, number, title, content, 'Diagonal Debater')
  // Convert PDFDocument to Buffer
  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })

  // Use the bill number as the filename (e.g., D411.pdf)
  const filename = `${number}.pdf`

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

export async function POST(req: NextRequest) {
  let data: any = {}
  try {
    data = await req.json()
  } catch {}
  const type = data.type || 'bill'
  const category = data.category || 'domestic'
  const number = data.number || 'D411'
  const title = data.title || 'A BILL TO PROMOTE ENVIRONMENTALLY RESPONSIBLE DATA CENTER DEVELOPMENT'
  const content = data.content || `SECTION 1.  This Act may be cited as the "Green Data Center Act".\n\nSECTION 2.  The purpose of this Act is to encourage the construction and operation of environmentally responsible data centers.\n\nA.  All new data centers must meet energy efficiency standards.\nB.  The Department of Energy shall oversee compliance.\n\nSECTION 3.  Funding for this Act shall be provided by the Department of Energy.\n\nSECTION 4.  This Act shall take effect immediately upon passage.`

  const doc = await generateLegislationPDF(type, category, number, title, content, 'Test User')
  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })
  const filename = `${number}.pdf`
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
} 