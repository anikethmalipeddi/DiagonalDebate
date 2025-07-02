"use client"
import { Document, Page, pdfjs } from 'react-pdf';
import React, { useState } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export default function PDFPreview({ file }: { file: string }) {
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess() {
    console.log('PDF preview loaded successfully:', { file });
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF preview load error:', { file, error });
    setError(error.message);
  }

  return (
    <Document 
      file={file} 
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={onDocumentLoadError}
      loading={<div className='text-xs text-gray-400'>Loading preview...</div>} 
      noData={<div className='text-xs text-gray-400'>No preview</div>}
      error={
        <div className='text-xs text-red-400'>
          Failed to load preview: {error || 'Unknown error'}
        </div>
      }
    >
      <Page 
        pageNumber={1} 
        width={360} 
        height={160} 
        renderTextLayer={false} 
        renderAnnotationLayer={false} 
      />
    </Document>
  );
} 