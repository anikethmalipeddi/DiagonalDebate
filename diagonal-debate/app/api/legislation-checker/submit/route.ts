import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { emailToCaptains, LegislationData } from '@/lib/email'
import PDFDocument from 'pdfkit'
import path from 'path'
import { randomUUID } from 'crypto'
import { sendEmail } from '@/lib/email'

/* -------------------------------------------------------------------------
   Rock Ridge – PDF generator (EXACT template match with fixed alignment)
   ------------------------------------------------------------------------- */

// ---------- page geometry (exact specifications) ----------
const PAGE_W = 612 // 8.5 in × 72 pt
const PAGE_H = 792 // 11 in × 72 pt
const MARGIN_TOP   = 50.4  // 0.7″
const MARGIN_SIDE  = 50.4  // 0.7″
const MARGIN_BOTTOM= 36    // 0.5″
const GUTTER = 22          // 0.31″ line‑number gutter
const TEXT_X = MARGIN_SIDE + GUTTER
const TEXT_W = PAGE_W - TEXT_X - MARGIN_SIDE

// spacing
const SINGLE_SPACING = 14.4  // 1.2 × 12 pt
const BODY_SPACING = 22      // Increased line spacing for better readability

// fonts
const FONT_REG = 'TimesNewRoman'
const FONT_BOLD = 'TimesNewRoman-Bold'
const FONT_ITAL = 'TimesNewRoman-Italic'

// ---------- helper to parse content ----------
function parseContent(rawContent: string) {
  const sections = []
  const lines = rawContent.split('\n').map(line => line.trim()).filter(line => line)
  
  let currentSection = null
  
  for (const line of lines) {
    // Skip empty lines and line number markers
    if (!line || line.match(/^Line\s*\d+:/i)) continue
    
    // Section headings (SECTION X. for bills, WHEREAS/RESOLVED for resolutions, ARTICLE for amendments)
    const sectionMatch = line.match(/^(SECTION\s+\d+[\.:]\s*|WHEREAS,|RESOLVED,|FURTHER\s+RESOLVED,|ARTICLE\s*--?)\s*(.*)$/i)
    if (sectionMatch) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection)
      }
      
      // Start new section
      currentSection = {
        type: 'section',
        heading: sectionMatch[1].toUpperCase().replace(/,$/, ','), // Keep comma for WHEREAS, RESOLVED
        content: [{
          type: 'main_text',
          text: sectionMatch[2].trim()
        }]
      }
      continue
    }
    
    // Subsections or continuation text
    if (currentSection) {
      // Check if this is a subsection (A., B., etc.)
      if (line.match(/^[A-Z]\.\s/)) {
        currentSection.content.push({
          type: 'subsection',
          text: line
        })
      } else {
        // This is continuation text for the main section or last subsection
        if (currentSection.content.length > 0) {
          const lastItem = currentSection.content[currentSection.content.length - 1]
          if (lastItem.type === 'main_text') {
            // Append to main text
            lastItem.text += ' ' + line
          } else {
            // This is continuation of a subsection or new main text
            currentSection.content.push({
              type: 'main_text',
              text: line
            })
          }
        }
      }
    } else {
      // Standalone text
      sections.push({
        type: 'text',
        text: line
      })
    }
  }
  
  // Add the last section
  if (currentSection) {
    sections.push(currentSection)
  }
  
  return sections
}

// ---------- PDF generator ----------
export async function generateLegislationPDF(
  type: 'bill' | 'resolution' | 'amendment',
  _category: string,
  number: string,
  title: string,
  rawContent: string,
  submitterName: string
) {
  const doc = new PDFDocument({
    size: [PAGE_W, PAGE_H],
    margins: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_SIDE, right: MARGIN_SIDE }
  })
  
  const fontDir = path.join(process.cwd(), 'public', 'fonts')
  doc.registerFont(FONT_REG, path.join(fontDir, 'timesNewRoman.ttf'))
  doc.registerFont(FONT_BOLD, path.join(fontDir, 'timesnewromanbold.ttf'))
  doc.registerFont(FONT_ITAL, path.join(fontDir, 'timesnewromanitalic.ttf'))

  let currentLineNumber = 0
  let currentY = MARGIN_TOP

  // Calculate the alignment position for body text (after "RESOLVED, ")
  doc.font(FONT_BOLD).fontSize(12)
  const resolvedWidth = doc.widthOfString('RESOLVED, ')
  const BODY_TEXT_X = TEXT_X + resolvedWidth

  // Helper: write a numbered line
  const writeNumberedLine = (content: string, font = FONT_REG, xPosition = TEXT_X) => {
    currentLineNumber++
    currentY += BODY_SPACING
    
    // Write line number (right-aligned in gutter with 2 spaces after)
    doc.font(FONT_REG).fontSize(12)
    const numberText = String(currentLineNumber) + '  '
    const numberX = TEXT_X - doc.widthOfString(numberText)
    doc.text(numberText, numberX, currentY)
    
    // Write content at specified x position
    doc.font(font).fontSize(12).text(content, xPosition, currentY)
  }

  // Helper: write centered line with line number (for ARTICLE --)
  const writeCenteredNumberedLine = (content: string, font = FONT_BOLD) => {
    currentLineNumber++
    currentY += BODY_SPACING
    
    // Write line number (right-aligned in gutter with 2 spaces after)
    doc.font(FONT_REG).fontSize(12)
    const numberText = String(currentLineNumber) + '  '
    const numberX = TEXT_X - doc.widthOfString(numberText)
    doc.text(numberText, numberX, currentY)
    
    // Write content centered
    doc.font(font).fontSize(12).text(content, TEXT_X, currentY, { width: TEXT_W, align: 'center' })
  }

  // Helper: write amendment section content with proper alignment
  const writeAmendmentSectionContent = (heading: string, contentItems: any[]) => {
    if (heading === 'RESOLVED,') {
      doc.font(FONT_BOLD).fontSize(12)
      const headingWidth = doc.widthOfString(heading + ' ')
      const sectionTextStart = TEXT_X + headingWidth
      
      let isFirstLine = true
      
      for (const item of contentItems) {
        if (item.type === 'main_text' && item.text.trim()) {
          // Handle main text with word wrapping
          const words = item.text.split(' ')
          let currentLine = ''
          
          for (let i = 0; i < words.length; i++) {
            const word = words[i]
            const testLine = currentLine ? currentLine + ' ' + word : word
            
            doc.font(FONT_REG).fontSize(12)
            const availableWidth = isFirstLine ? 
              TEXT_W - headingWidth : // First line: account for section heading
              TEXT_W - headingWidth   // Continuation lines: same alignment as first line text
            
            if (doc.widthOfString(testLine) > availableWidth && currentLine) {
              // Line is full, output it
              if (isFirstLine) {
                // First line: section heading + text
                currentLineNumber++
                currentY += BODY_SPACING
                
                // Write line number
                doc.font(FONT_REG).fontSize(12)
                const numberText = String(currentLineNumber) + '  '
                const numberX = TEXT_X - doc.widthOfString(numberText)
                doc.text(numberText, numberX, currentY)
                
                // Write section heading (bold) + text (regular)
                doc.font(FONT_BOLD).fontSize(12).text(heading + ' ', TEXT_X, currentY, { continued: true })
                doc.font(FONT_REG).fontSize(12).text(currentLine, { continued: false })
                
                isFirstLine = false
              } else {
                // Continuation line: align with the text part of the first line
                writeNumberedLine(currentLine, FONT_REG, sectionTextStart)
              }
              currentLine = word
            } else {
              currentLine = testLine
            }
          }
          
          // Output final line of main text
          if (currentLine) {
            if (isFirstLine) {
              // First and only line
              currentLineNumber++
              currentY += BODY_SPACING
              
              // Write line number
              doc.font(FONT_REG).fontSize(12)
              const numberText = String(currentLineNumber) + '  '
              const numberX = TEXT_X - doc.widthOfString(numberText)
              doc.text(numberText, numberX, currentY)
              
              // Write section heading (bold) + text (regular)
              doc.font(FONT_BOLD).fontSize(12).text(heading + ' ', TEXT_X, currentY, { continued: true })
              doc.font(FONT_REG).fontSize(12).text(currentLine, { continued: false })
              
              isFirstLine = false
            } else {
              // Final continuation line
              writeNumberedLine(currentLine, FONT_REG, sectionTextStart)
            }
          }
          
        } else if (item.type === 'subsection') {
          // Handle subsections with proper wrapping alignment
          isFirstLine = false
          
          // Extract the letter part (A., B., etc.) and the content
          const match = item.text.match(/^([A-Z]\.)\s*(.*)$/)
          if (match) {
            const letter = match[1]
            const subsectionContent = match[2]
            
            // Calculate alignment position after the letter
            doc.font(FONT_REG).fontSize(12)
            const letterWidth = doc.widthOfString(letter + ' ')
            const subsectionContentStart = sectionTextStart + letterWidth
            
            // Handle wrapping for subsection content
            const words = subsectionContent.split(' ')
            let currentLine = ''
            let isFirstSubLine = true
            
            for (let i = 0; i < words.length; i++) {
              const word = words[i]
              const testLine = currentLine ? currentLine + ' ' + word : word
              
              const availableWidth = TEXT_W - (subsectionContentStart - TEXT_X)
              
              if (doc.widthOfString(testLine) > availableWidth && currentLine) {
                // Line is full, output it
                if (isFirstSubLine) {
                  // First line: letter + content
                  currentLineNumber++
                  currentY += BODY_SPACING
                  
                  // Write line number
                  doc.font(FONT_REG).fontSize(12)
                  const numberText = String(currentLineNumber) + '  '
                  const numberX = TEXT_X - doc.widthOfString(numberText)
                  doc.text(numberText, numberX, currentY)
                  
                  // Write letter and content
                  doc.text(letter + ' ' + currentLine, sectionTextStart, currentY)
                  isFirstSubLine = false
                } else {
                  // Continuation line: align with subsection content
                  writeNumberedLine(currentLine, FONT_REG, subsectionContentStart)
                }
                currentLine = word
              } else {
                currentLine = testLine
              }
            }
            
            // Output final line
            if (currentLine) {
              if (isFirstSubLine) {
                // Single line subsection
                currentLineNumber++
                currentY += BODY_SPACING
                
                // Write line number
                doc.font(FONT_REG).fontSize(12)
                const numberText = String(currentLineNumber) + '  '
                const numberX = TEXT_X - doc.widthOfString(numberText)
                doc.text(numberText, numberX, currentY)
                
                // Write letter and content
                doc.text(letter + ' ' + currentLine, sectionTextStart, currentY)
              } else {
                // Final continuation line
                writeNumberedLine(currentLine, FONT_REG, subsectionContentStart)
              }
            }
          } else {
            // Fallback for malformed subsections
            writeNumberedLine(item.text, FONT_REG, sectionTextStart)
          }
        }
      }
      
    } else if (heading === 'ARTICLE --' || heading === 'ARTICLE-') {
      // Handle ARTICLE -- as centered heading
      writeCenteredNumberedLine(heading)
      
      // Add content after ARTICLE -- if it exists
      for (const item of contentItems) {
        if (item.type === 'main_text' && item.text.trim()) {
          writeWrappedText(item.text, FONT_REG, 0, BODY_TEXT_X)
        } else if (item.type === 'subsection') {
          writeNumberedLine(item.text, FONT_REG, BODY_TEXT_X)
        }
      }
      
    } else if (heading.match(/^SECTION\s+\d+[\.:]/i)) {
      // Handle SECTION X: - content comes AFTER the colon and aligns with first letter of content
      const cleanHeading = heading.replace(/:\s*$/, '') + ':'
      
      // Calculate the alignment position (after "SECTION X: ")
      doc.font(FONT_BOLD).fontSize(12)
      const sectionWidth = doc.widthOfString(cleanHeading + ' ')
      const sectionTextStart = BODY_TEXT_X + sectionWidth
      
      let isFirstLine = true
      
      for (const item of contentItems) {
        if (item.type === 'main_text' && item.text.trim()) {
          // Handle main text with word wrapping
          const words = item.text.split(' ')
          let currentLine = ''
          
          for (let i = 0; i < words.length; i++) {
            const word = words[i]
            const testLine = currentLine ? currentLine + ' ' + word : word
            
            doc.font(FONT_REG).fontSize(12)
            const availableWidth = isFirstLine ? 
              TEXT_W - sectionWidth - resolvedWidth : // First line: account for section heading
              TEXT_W - sectionWidth - resolvedWidth   // Continuation lines: same alignment
            
            if (doc.widthOfString(testLine) > availableWidth && currentLine) {
              // Line is full, output it
              if (isFirstLine) {
                // First line: section heading + text
                currentLineNumber++
                currentY += BODY_SPACING
                
                // Write line number
                doc.font(FONT_REG).fontSize(12)
                const numberText = String(currentLineNumber) + '  '
                const numberX = TEXT_X - doc.widthOfString(numberText)
                doc.text(numberText, numberX, currentY)
                
                // Write section heading (bold) at body text alignment + text (regular)
                doc.font(FONT_BOLD).fontSize(12).text(cleanHeading + ' ', BODY_TEXT_X, currentY, { continued: true })
                doc.font(FONT_REG).fontSize(12).text(currentLine, { continued: false })
                
                isFirstLine = false
              } else {
                // Continuation line: align with the text part of the first line
                writeNumberedLine(currentLine, FONT_REG, sectionTextStart)
              }
              currentLine = word
            } else {
              currentLine = testLine
            }
          }
          
          // Output final line of main text
          if (currentLine) {
            if (isFirstLine) {
              // First and only line
              currentLineNumber++
              currentY += BODY_SPACING
              
              // Write line number
              doc.font(FONT_REG).fontSize(12)
              const numberText = String(currentLineNumber) + '  '
              const numberX = TEXT_X - doc.widthOfString(numberText)
              doc.text(numberText, numberX, currentY)
              
              // Write section heading (bold) at body text alignment + text (regular)
              doc.font(FONT_BOLD).fontSize(12).text(cleanHeading + ' ', BODY_TEXT_X, currentY, { continued: true })
              doc.font(FONT_REG).fontSize(12).text(currentLine, { continued: false })
              
              isFirstLine = false
            } else {
              // Final continuation line
              writeNumberedLine(currentLine, FONT_REG, sectionTextStart)
            }
          }
          
        } else if (item.type === 'subsection') {
          // Handle subsections with proper wrapping alignment
          isFirstLine = false
          
          // Extract the letter part (A., B., etc.) and the content
          const match = item.text.match(/^([A-Z]\.)\s*(.*)$/)
          if (match) {
            const letter = match[1]
            const subsectionContent = match[2]
            
            // Calculate alignment position after the letter
            doc.font(FONT_REG).fontSize(12)
            const letterWidth = doc.widthOfString(letter + ' ')
            const subsectionContentStart = sectionTextStart + letterWidth
            
            // Handle wrapping for subsection content
            const words = subsectionContent.split(' ')
            let currentLine = ''
            let isFirstSubLine = true
            
            for (let i = 0; i < words.length; i++) {
              const word = words[i]
              const testLine = currentLine ? currentLine + ' ' + word : word
              
              const availableWidth = TEXT_W - (subsectionContentStart - TEXT_X)
              
              if (doc.widthOfString(testLine) > availableWidth && currentLine) {
                // Line is full, output it
                if (isFirstSubLine) {
                  // First line: letter + content
                  currentLineNumber++
                  currentY += BODY_SPACING
                  
                  // Write line number
                  doc.font(FONT_REG).fontSize(12)
                  const numberText = String(currentLineNumber) + '  '
                  const numberX = TEXT_X - doc.widthOfString(numberText)
                  doc.text(numberText, numberX, currentY)
                  
                  // Write letter and content
                  doc.text(letter + ' ' + currentLine, sectionTextStart, currentY)
                  isFirstSubLine = false
                } else {
                  // Continuation line: align with subsection content
                  writeNumberedLine(currentLine, FONT_REG, subsectionContentStart)
                }
                currentLine = word
              } else {
                currentLine = testLine
              }
            }
            
            // Output final line
            if (currentLine) {
              if (isFirstSubLine) {
                // Single line subsection
                currentLineNumber++
                currentY += BODY_SPACING
                
                // Write line number
                doc.font(FONT_REG).fontSize(12)
                const numberText = String(currentLineNumber) + '  '
                const numberX = TEXT_X - doc.widthOfString(numberText)
                doc.text(numberText, numberX, currentY)
                
                // Write letter and content
                doc.text(letter + ' ' + currentLine, sectionTextStart, currentY)
              } else {
                // Final continuation line
                writeNumberedLine(currentLine, FONT_REG, subsectionContentStart)
              }
            }
          } else {
            // Fallback for malformed subsections
            writeNumberedLine(item.text, FONT_REG, sectionTextStart)
          }
        }
      }
      
    } else {
      // Default handling for other sections
      writeSectionContent(heading, contentItems)
    }
  }

  // Helper: write section content with proper alignment (original function)
  const writeSectionContent = (heading: string, contentItems: any[]) => {
    if (contentItems.length === 0) return
    
    doc.font(FONT_BOLD).fontSize(12)
    const headingWidth = doc.widthOfString(heading + ' ')
    const sectionTextStart = TEXT_X + headingWidth
    
    let isFirstLine = true
    
    for (const item of contentItems) {
      if (item.type === 'main_text' && item.text.trim()) {
        // Handle main text with word wrapping
        const words = item.text.split(' ')
        let currentLine = ''
        
        for (let i = 0; i < words.length; i++) {
          const word = words[i]
          const testLine = currentLine ? currentLine + ' ' + word : word
          
          doc.font(FONT_REG).fontSize(12)
          const availableWidth = isFirstLine ? 
            TEXT_W - headingWidth : // First line: account for section heading
            TEXT_W - headingWidth   // Continuation lines: same alignment as first line text
          
          if (doc.widthOfString(testLine) > availableWidth && currentLine) {
            // Line is full, output it
            if (isFirstLine) {
              // First line: section heading + text
              currentLineNumber++
              currentY += BODY_SPACING
              
              // Write line number
              doc.font(FONT_REG).fontSize(12)
              const numberText = String(currentLineNumber) + '  '
              const numberX = TEXT_X - doc.widthOfString(numberText)
              doc.text(numberText, numberX, currentY)
              
              // Write section heading (bold) + text (regular)
              doc.font(FONT_BOLD).fontSize(12).text(heading + ' ', TEXT_X, currentY, { continued: true })
              doc.font(FONT_REG).fontSize(12).text(currentLine, { continued: false })
              
              isFirstLine = false
            } else {
              // Continuation line: align with the text part of the first line
              writeNumberedLine(currentLine, FONT_REG, sectionTextStart)
            }
            currentLine = word
          } else {
            currentLine = testLine
          }
        }
        
        // Output final line of main text
        if (currentLine) {
          if (isFirstLine) {
            // First and only line
            currentLineNumber++
            currentY += BODY_SPACING
            
            // Write line number
            doc.font(FONT_REG).fontSize(12)
            const numberText = String(currentLineNumber) + '  '
            const numberX = TEXT_X - doc.widthOfString(numberText)
            doc.text(numberText, numberX, currentY)
            
            // Write section heading (bold) + text (regular)
            doc.font(FONT_BOLD).fontSize(12).text(heading + ' ', TEXT_X, currentY, { continued: true })
            doc.font(FONT_REG).fontSize(12).text(currentLine, { continued: false })
            
            isFirstLine = false
          } else {
            // Final continuation line
            writeNumberedLine(currentLine, FONT_REG, sectionTextStart)
          }
        }
        
      } else if (item.type === 'subsection') {
        // Handle subsections with proper wrapping alignment
        isFirstLine = false
        
        // Parse the subsection to separate letter from content
        const subsectionMatch = item.text.match(/^([A-Z]\.)\s*(.*)$/)
        if (subsectionMatch) {
          const letter = subsectionMatch[1] // "A.", "B.", etc.
          const content = subsectionMatch[2] // The actual text after the letter
          
          // Calculate where the content should start (after the letter)
          doc.font(FONT_REG).fontSize(12)
          const letterWidth = doc.widthOfString(letter + ' ')
          const contentStartX = sectionTextStart + letterWidth
          
          // Write the subsection with proper wrapping
          const words = content.split(' ')
          let currentLine = ''
          let isFirstSubLine = true
          
          for (const word of words) {
            const testLine = currentLine ? currentLine + ' ' + word : word
            const availableWidth = TEXT_W - (contentStartX - TEXT_X)
            
            if (doc.widthOfString(testLine) > availableWidth && currentLine) {
              // Output current line
              if (isFirstSubLine) {
                // First line includes the letter
                currentLineNumber++
                currentY += BODY_SPACING
                
                const numberText = String(currentLineNumber) + '  '
                const numberX = TEXT_X - doc.widthOfString(numberText)
                doc.text(numberText, numberX, currentY)
                doc.text(letter + ' ' + currentLine, sectionTextStart, currentY)
                isFirstSubLine = false
              } else {
                // Continuation lines align under the content
                writeNumberedLine(currentLine, FONT_REG, contentStartX)
              }
              currentLine = word
            } else {
              currentLine = testLine
            }
          }
          
          // Output the final line
          if (currentLine) {
            if (isFirstSubLine) {
              currentLineNumber++
              currentY += BODY_SPACING
              
              const numberText = String(currentLineNumber) + '  '
              const numberX = TEXT_X - doc.widthOfString(numberText)
              doc.text(numberText, numberX, currentY)
              doc.text(letter + ' ' + currentLine, sectionTextStart, currentY)
            } else {
              writeNumberedLine(currentLine, FONT_REG, contentStartX)
            }
          }
        } else {
          // Fallback for malformed subsections
          writeNumberedLine(item.text, FONT_REG, sectionTextStart)
        }
      }
    }
  }

  // Helper: write regular text with wrapping
  const writeWrappedText = (text: string, font = FONT_REG, indent = 0, baseX = TEXT_X) => {
    const words = text.split(' ')
    let currentLine = ''
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const testLine = currentLine ? currentLine + ' ' + word : word
      
      doc.font(font).fontSize(12)
      const availableWidth = TEXT_W - (baseX - TEXT_X) - indent
      
      if (doc.widthOfString(testLine) > availableWidth && currentLine) {
        writeNumberedLine(currentLine, font, baseX + indent)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      writeNumberedLine(currentLine, font, baseX + indent)
    }
  }

  // Helper: convert title to proper case
  const toTitleCase = (str: string) => {
    const articles = ['a', 'an', 'the']
    const prepositions = ['to', 'of', 'for', 'in', 'on', 'at', 'by', 'with', 'from']
    const conjunctions = ['and', 'or', 'but', 'nor', 'so', 'yet']
    const lowercaseWords = [...articles, ...prepositions, ...conjunctions]
    
    return str.split(' ').map((word, index) => {
      const lowerWord = word.toLowerCase()
      if (index === 0 || !lowercaseWords.includes(lowerWord)) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
      return lowerWord
    }).join(' ')
  }

  // Helper: split title into 2 lines
  const splitTitleIntoTwoLines = (titleText: string) => {
    const words = titleText.split(' ')
    const maxWidth = PAGE_W - 2 * MARGIN_SIDE
    
    doc.font(FONT_BOLD).fontSize(16)
    
    let bestSplit = Math.floor(words.length / 2)
    let bestScore = Infinity
    
    for (let i = 1; i < words.length; i++) {
      const line1 = words.slice(0, i).join(' ')
      const line2 = words.slice(i).join(' ')
      
      const width1 = doc.widthOfString(line1)
      const width2 = doc.widthOfString(line2)
      
      if (width1 <= maxWidth && width2 <= maxWidth) {
        const score = Math.abs(width1 - width2) - (width1 * 0.1)
        if (score < bestScore) {
          bestScore = score
          bestSplit = i
        }
      }
    }
    
    return {
      line1: words.slice(0, bestSplit).join(' '),
      line2: words.slice(bestSplit).join(' ')
    }
  }

  // ---------- TITLE BLOCK ----------
  doc.font(FONT_BOLD).fontSize(12)
  currentY = MARGIN_TOP + 10
  
  const docNum = number.replace(/^[^\d]*/, '')
  
  // Dynamic header based on type
  let headerText = ''
  switch (type) {
    case 'bill':
      headerText = `Bill # ${docNum}`
      break
    case 'resolution':
      headerText = `Bill # ${docNum}` // Note: Resolution template still shows "Bill #" in the image
      break
    case 'amendment':
      headerText = `Amendment # ${docNum}`
      break
  }
  
  doc.text(headerText, 0, currentY, { width: PAGE_W, align: 'center' })
  
  currentY += 18
  
  // Dynamic title formatting based on type
  let titleText = ''
  if (type === 'resolution') {
    // For resolutions, format as "A Resolution to [title]"
    titleText = title.toLowerCase().startsWith('a resolution to') ? 
      toTitleCase(title) : 
      toTitleCase(`A Resolution to ${title}`)
  } else if (type === 'amendment') {
    // For amendments, format as "A Resolution to Amend the Constitution [to... title]"
    if (title.toLowerCase().startsWith('a resolution to amend the constitution')) {
      titleText = toTitleCase(title)
    } else if (title.toLowerCase().startsWith('to amend the constitution')) {
      titleText = toTitleCase(`A Resolution ${title}`)
    } else {
      titleText = toTitleCase(`A Resolution to Amend the Constitution to ${title}`)
    }
  } else {
    titleText = toTitleCase(title)
  }
  
  doc.font(FONT_BOLD).fontSize(16)
  
  const { line1, line2 } = splitTitleIntoTwoLines(titleText)
  
  doc.text(line1, MARGIN_SIDE, currentY, { width: PAGE_W - 2 * MARGIN_SIDE, align: 'center' })
  currentY += 16
  
  doc.text(line2, MARGIN_SIDE, currentY, { width: PAGE_W - 2 * MARGIN_SIDE, align: 'center' })
  
  // ---------- ENACTMENT/PREAMBLE CLAUSE ----------
  currentY += 35
  doc.font(FONT_REG).fontSize(12)
  
  // Different clauses based on type
  if (type === 'bill') {
    doc.text('BE IT ENACTED BY THE CONGRESS HERE ASSEMBLED THAT:', TEXT_X, currentY)
  } else if (type === 'resolution') {
    // Resolutions don't have an enactment clause - they go straight to WHEREAS clauses
    currentY -= BODY_SPACING // Adjust spacing since we're not adding a clause
  } else if (type === 'amendment') {
    // Amendments use resolution format - no enactment clause
    currentY -= BODY_SPACING // Adjust spacing since we're not adding a clause
  }
  
  // ---------- NUMBERED BODY ----------
  const sections = parseContent(rawContent)
  
  for (const section of sections) {
    if (section.type === 'section') {
      if (type === 'amendment') {
        writeAmendmentSectionContent(section.heading ?? '', section.content ?? [])
      } else {
        writeSectionContent(section.heading ?? '', section.content ?? [])
      }
    } else if (section.type === 'text') {
      writeWrappedText(section.text ?? '')
    }
  }
  
  // ---------- FOOTER ----------
  currentY += BODY_SPACING + 10
  const footerX = TEXT_X + TEXT_W - 200
  
  doc.font(FONT_ITAL).fontSize(12)
  doc.text('Respectfully Submitted,', footerX, currentY, { width: 200, align: 'right' })
  currentY += SINGLE_SPACING
  
  doc.font(FONT_REG).fontSize(12)
  doc.text(`Representative ${submitterName || '_______'}`, footerX, currentY, { width: 200, align: 'right' })
  currentY += SINGLE_SPACING
  
  doc.text('Rock Ridge High School', footerX, currentY, { width: 200, align: 'right' })

  doc.end()
  return doc
}

// ---------- strict template adherence check ----------
function checkTemplateAdherence(type: 'bill' | 'resolution' | 'amendment', content: string) {
  const errors: string[] = [];
  const lines = content.split(/\n/).map(l => l.trim()).filter(Boolean);

  if (type === 'bill') {
    // Only check for SECTION 1-6 in order (do NOT require enactment clause in user input)
    const sectionOrder = [
      /^SECTION 1[\.:]/i,
      /^SECTION 2[\.:]/i,
      /^SECTION 3[\.:]/i,
      /^SECTION 4[\.:]/i,
      /^SECTION 5[\.:]/i,
      /^SECTION 6[\.:]/i,
    ];
    let lastFound = -1;
    for (let i = 0; i < sectionOrder.length; i++) {
      const idx = lines.findIndex(line => sectionOrder[i].test(line));
      if (idx === -1) {
        errors.push(`Missing required section: SECTION ${i + 1}.`);
      } else if (idx < lastFound) {
        errors.push(`SECTION ${i + 1} appears out of order.`);
      } else {
        lastFound = idx;
      }
    }
  } else if (type === 'resolution') {
    // 1. At least one WHEREAS
    const whereasIdxs = lines.map((line, i) => (/^WHEREAS,/i.test(line) ? i : -1)).filter(i => i !== -1);
    if (whereasIdxs.length === 0) {
      errors.push("Missing required 'WHEREAS,' clause(s).");
    }
    // 2. RESOLVED must follow WHEREAS
    const resolvedIdx = lines.findIndex(line => /^RESOLVED,/i.test(line));
    if (resolvedIdx === -1) {
      errors.push("Missing required 'RESOLVED,' clause.");
    } else if (whereasIdxs.length > 0 && resolvedIdx < Math.max(...whereasIdxs)) {
      errors.push("'RESOLVED,' must come after all 'WHEREAS,' clauses.");
    }
    // 3. FURTHER RESOLVED is optional, but if present, must follow RESOLVED
    const furtherResolvedIdx = lines.findIndex(line => /^FURTHER RESOLVED,/i.test(line));
    if (furtherResolvedIdx !== -1 && furtherResolvedIdx < resolvedIdx) {
      errors.push("'FURTHER RESOLVED,' must come after 'RESOLVED,' clause.");
    }
  } else if (type === 'amendment') {
    // 1. RESOLVED must be present and first
    const resolvedIdx = lines.findIndex(line => /^RESOLVED,/i.test(line));
    if (resolvedIdx !== 0) {
      errors.push("'RESOLVED,' clause must be the first line of the amendment body.");
    }
    // 2. ARTICLE -- must be present after RESOLVED
    const articleIdx = lines.findIndex(line => /^ARTICLE\s*--/i.test(line));
    if (articleIdx === -1) {
      errors.push("Missing required 'ARTICLE --' line after 'RESOLVED,' clause.");
    } else if (resolvedIdx !== -1 && articleIdx < resolvedIdx) {
      errors.push("'ARTICLE --' must come after 'RESOLVED,' clause.");
    }
    // 3. SECTION 1 and SECTION 2 must be present and in order after ARTICLE --
    const section1Idx = lines.findIndex(line => /^SECTION 1[\.:]/i.test(line));
    const section2Idx = lines.findIndex(line => /^SECTION 2[\.:]/i.test(line));
    if (section1Idx === -1) {
      errors.push("Missing required 'SECTION 1.' after 'ARTICLE --'.");
    }
    if (section2Idx === -1) {
      errors.push("Missing required 'SECTION 2.' after 'ARTICLE --'.");
    }
    if (section1Idx !== -1 && section2Idx !== -1 && section2Idx < section1Idx) {
      errors.push("'SECTION 2.' must come after 'SECTION 1.' in the amendment.");
    }
  }
  return errors;
}

// ---------- route handler ----------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { title, description, pdfContent, pdfText } = await request.json()

    if (!title || !description || !pdfContent) {
      return NextResponse.json(
        { error: 'Title, description, and PDF content are required' },
        { status: 400 }
      )
    }

    // Save submission to database
    const submission = await prisma.legislationSubmission.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        title,
        description,
        pdfContent,
        pdfText: pdfText || null
      }
    })

    // Send email notification
    await sendEmail(
      'New Legislation Submission',
      `New legislation submission received:\n\nTitle: ${title}\nDescription: ${description}\nSubmitted by: ${user.name} (${user.email})\n\nPDF content length: ${pdfContent.length} characters`
    )

    return NextResponse.json({ 
      success: true, 
      submissionId: submission.id 
    })
  } catch (error) {
    console.error('Legislation submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}