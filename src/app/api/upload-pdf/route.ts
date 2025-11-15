import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Helper function to chunk text for better context retrieval
function chunkText(text: string, chunkSize: number = 2000, overlap: number = 200): string[] {
  const chunks: string[] = []
  let start = 0
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    let chunk = text.slice(start, end)
    
    // Try to break at sentence boundaries
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.')
      const lastNewline = chunk.lastIndexOf('\n')
      const breakPoint = Math.max(lastPeriod, lastNewline)
      
      if (breakPoint > chunkSize * 0.5) {
        chunk = text.slice(start, start + breakPoint + 1)
        start = start + breakPoint + 1 - overlap
      } else {
        start = end - overlap
      }
    } else {
      start = end
    }
    
    chunks.push(chunk.trim())
  }
  
  return chunks.filter(chunk => chunk.length > 0)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const eventId = formData.get('eventId') as string

    if (!file || !eventId) {
      return NextResponse.json(
        { error: 'File and eventId are required' },
        { status: 400 }
      )
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Generate unique file name
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${eventId}/${timestamp}-${sanitizedName}`

    // Convert the file to buffer (matching the working pattern)
    const buffer = await file.arrayBuffer()

    // Parse the PDF using PDFParse class
    let extractedText = ''
    try {
      // Use dynamic import to get the ESM version
      const pdfParseModule = await import('pdf-parse')
      
      // The module exports PDFParse as a class - we need to use it properly
      const PDFParse = pdfParseModule.PDFParse || pdfParseModule.default?.PDFParse || pdfParseModule.default
      
      if (!PDFParse) {
        throw new Error(
          `PDFParse class not found. Module keys: ${Object.keys(pdfParseModule || {}).join(', ')}`
        )
      }
      
      console.log('Using PDFParse class, creating instance...')
      
      // Create an instance of PDFParse with the buffer
      const pdfParser = new PDFParse({ data: Buffer.from(buffer) })
      
      // Use getText() method to extract text
      const textResult = await pdfParser.getText()
      
      extractedText = textResult.text || ''
      
      // Log parsing info for debugging
      console.log(`PDF processed. Total pages: ${textResult.total}, Text length: ${extractedText.length}`)
      
      if (!extractedText || extractedText.trim().length === 0) {
        console.warn('PDF parsed but no text content found - may be image-based PDF')
        return NextResponse.json(
          { error: 'PDF appears to be empty or contains no extractable text' },
          { status: 400 }
        )
      }
    } catch (parseError: any) {
      console.error('Error parsing PDF:', parseError)
      console.error('Error details:', {
        message: parseError?.message,
        stack: parseError?.stack?.split('\n').slice(0, 5).join('\n'),
        name: parseError?.name,
      })
      return NextResponse.json(
        { 
          error: 'Failed to parse PDF. Please ensure the file is a valid PDF.',
          details: parseError?.message || 'Unknown error'
        },
        { status: 400 }
      )
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'PDF appears to be empty or contains no extractable text' },
        { status: 400 }
      )
    }

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('knowledge-base-pdfs')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: `Failed to upload file: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL (or signed URL if bucket is private)
    const { data: urlData } = supabase.storage
      .from('knowledge-base-pdfs')
      .getPublicUrl(fileName)

    // Chunk the text for better context retrieval
    const chunks = chunkText(extractedText)
    const chunkCount = chunks.length

    // Save to knowledge_base table
    const { data: kbData, error: kbError } = await supabase
      .from('knowledge_base')
      .insert({
        event_id: eventId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        file_type: 'application/pdf',
        extracted_text: extractedText,
        chunk_count: chunkCount,
      })
      .select()
      .single()

    if (kbError) {
      console.error('Database insert error:', kbError)
      // Try to clean up uploaded file
      await supabase.storage.from('knowledge-base-pdfs').remove([fileName])
      return NextResponse.json(
        { error: `Failed to save to database: ${kbError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      knowledgeBase: kbData,
      message: `Successfully uploaded and processed PDF. Extracted ${extractedText.length} characters in ${chunkCount} chunks.`,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

