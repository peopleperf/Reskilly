import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    // Create new page
    const page = await browser.newPage()
    
    // Set content
    await page.setContent(data.html, {
      waitUntil: 'networkidle0'
    })
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    })
    
    // Close browser
    await browser.close()
    
    // Return PDF as response
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=ai-impact-analysis.pdf'
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
} 