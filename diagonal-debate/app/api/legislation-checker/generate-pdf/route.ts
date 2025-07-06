import { NextRequest, NextResponse } from 'next/server'
import { generateLegislationPDF } from '../submit/route'

export const dynamic = 'force-dynamic'

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
  const submitterName = data.submitterName || 'Unknown'

  const doc = await generateLegislationPDF(type, category, number, title, content, submitterName)
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