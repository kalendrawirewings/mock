import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ExtractedText {
  text: string;
  pageCount?: number;
  fileType: string;
}

export class FileTextExtractor {
  /**
   * Extract text from PDF files using PDF.js
   */
  private static async extractPDFText(file: File): Promise<ExtractedText> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Load the PDF document
      const loadingTask = pdfjs.getDocument({
        data: uint8Array,
        // Disable font loading to improve compatibility
        disableFontFace: true,
        // Skip broken PDFs
        stopAtErrors: false,
      });

      const pdf = await loadingTask.promise;
      let fullText = '';

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          // Combine all text items with proper spacing
          const pageText = textContent.items
            .map((item: any) => {
              // Handle text items with proper spacing
              if ('str' in item) {
                return item.str;
              }
              return '';
            })
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

          if (pageText) {
            fullText += `${pageText}\n\n`;
          }
        } catch (pageError) {
          console.warn(
            `Error extracting text from page ${pageNum}:`,
            pageError
          );
          // Continue with other pages
        }
      }

      if (!fullText.trim()) {
        throw new Error('No text content found in PDF');
      }

      return {
        text: fullText.trim(),
        pageCount: pdf.numPages,
        fileType: 'pdf',
      };
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(
        'Failed to extract text from PDF. The file might be corrupted or password-protected.'
      );
    }
  }

  /**
   * Extract text from DOCX files using mammoth
   */
  private static async extractDocxText(file: File): Promise<ExtractedText> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      if (!result.value.trim()) {
        throw new Error('No text content found in DOCX file');
      }

      return {
        text: result.value.trim(),
        fileType: 'docx',
      };
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error('Failed to extract text from DOCX file');
    }
  }

  /**
   * Extract text from DOC files (basic support)
   */
  private static async extractDocText(file: File): Promise<ExtractedText> {
    try {
      // For basic DOC files, try text extraction
      const text = await file.text();

      // Clean up the extracted text (DOC files may have binary content)
      const cleanText = text
        .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') // Remove control characters
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText || cleanText.length < 10) {
        throw new Error('Unable to extract readable text from DOC file');
      }

      return {
        text: cleanText,
        fileType: 'doc',
      };
    } catch (error) {
      console.error('DOC extraction error:', error);
      throw new Error(
        'Failed to extract text from DOC file. Consider converting to DOCX or PDF format.'
      );
    }
  }

  /**
   * Extract text from plain text files
   */
  private static async extractTxtText(file: File): Promise<ExtractedText> {
    try {
      const text = await file.text();

      if (!text.trim()) {
        throw new Error('Text file is empty');
      }

      return {
        text: text.trim(),
        fileType: 'txt',
      };
    } catch (error) {
      console.error('TXT extraction error:', error);
      throw new Error('Failed to read text file');
    }
  }

  /**
   * Main method to extract text from any supported file type
   */
  static async extractText(file: File): Promise<ExtractedText> {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    try {
      // Determine file type and use appropriate extractor
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await this.extractPDFText(file);
      } else if (
        fileType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')
      ) {
        return await this.extractDocxText(file);
      } else if (
        fileType === 'application/msword' ||
        fileName.endsWith('.doc')
      ) {
        return await this.extractDocText(file);
      } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        return await this.extractTxtText(file);
      } else {
        throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      // If extraction fails, provide helpful error message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to extract text from file');
    }
  }

  /**
   * Validate file before processing
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Please upload a file smaller than 50MB.',
      };
    }

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const hasValidType = allowedTypes.includes(fileType);
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidType && !hasValidExtension) {
      return {
        valid: false,
        error:
          'Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.',
      };
    }

    return { valid: true };
  }
}
