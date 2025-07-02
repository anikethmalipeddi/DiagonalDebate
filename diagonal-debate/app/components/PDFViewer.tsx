"use client"
import { Document, Page, pdfjs } from 'react-pdf';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Maximize2, Minimize2, RotateCw, ArrowLeft } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export default function PDFViewer({ file, fullscreenButton, initialFullscreen = false, onExit }: { file: string, fullscreenButton?: React.ReactNode, initialFullscreen?: boolean, onExit?: () => void }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [windowWidth, setWindowWidth] = useState(800);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(initialFullscreen);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [navBarPos, setNavBarPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const navBarRef = useRef<HTMLDivElement>(null);
  const [pageAspectRatio, setPageAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    // Set initial width
    setWindowWidth(window?.innerWidth || 800);

    // Handle window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Escape key exits fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [fullscreen]);

  // Scroll into view when exiting fullscreen
  useEffect(() => {
    if (!fullscreen && viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [fullscreen]);

  // Set default position on fullscreen enter
  useEffect(() => {
    if (fullscreen) {
      setNavBarPos(null); // Reset to default (bottom center)
    }
  }, [fullscreen]);

  // Drag handlers
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    const navBar = navBarRef.current;
    if (!navBar) return;
    const rect = navBar.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }
      setNavBarPos({
        x: clientX - dragOffset.current.x,
        y: clientY - dragOffset.current.y,
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully:', { file, numPages });
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  }, [file]);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', { file, error });
    setError(error.message);
  }, []);

  const pageWidth = fullscreen
    ? Math.min(1200, window.innerWidth * 0.98)
    : Math.min(900, windowWidth * 0.95);

  const handleExit = () => {
    if (onExit) onExit();
    else setFullscreen(false);
  };

  // On page load, get aspect ratio
  const onPageLoadSuccess = useCallback((page: any) => {
    if (page && page.view && page.view.length === 4) {
      const [x1, y1, x2, y2] = page.view;
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      setPageAspectRatio(width / height);
    }
  }, []);

  return (
    <div>
      {/* Normal mode */}
      {!fullscreen && (
        <div ref={viewerRef} className="h-full w-full flex items-center justify-center bg-gray-50 p-4 overflow-auto font-sans">
          <div className="flex flex-col items-center justify-center space-y-4">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="text-lg text-gray-600">Loading PDF...</div>
            </div>
          }
          noData={
            <div className="flex items-center justify-center p-8">
              <div className="text-lg text-gray-600">No PDF</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center p-8">
              <div className="text-lg text-red-600">
                Failed to load PDF: {error || 'Unknown error'}
              </div>
            </div>
          }
        >
          <div className="shadow-lg border border-gray-200 rounded-lg overflow-hidden bg-white">
            <Page 
              pageNumber={pageNumber} 
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        </Document>

        {numPages && numPages > 1 && (
              <div className="flex items-center justify-center space-x-4 bg-white rounded-lg shadow-md px-6 py-3 border border-gray-200 mt-2">
                <Button
                  size="lg"
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                  className="bg-red-600 hover:bg-red-700 text-white font-sans font-medium rounded-lg px-6 py-3 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
                >
                  Previous
                </Button>

                <span className="text-gray-700 font-bold min-w-[120px] text-center text-lg">
                  Page {pageNumber} of {numPages}
                </span>

                <Button
                  size="lg"
                  onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
                  disabled={pageNumber >= (numPages || 1)}
                  className="bg-red-600 hover:bg-red-700 text-white font-sans font-medium rounded-lg px-6 py-3 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
                >
                  Next
                </Button>
                <Button
                  size="lg"
                  onClick={handleExit}
                  className="bg-red-600 hover:bg-red-700 text-white font-sans font-medium rounded-lg px-6 py-3 transition-colors"
                >
                  <ArrowLeft className="inline w-5 h-5 mr-2" /> Back to Lessons
                </Button>
              </div>
            )}
            {/* Fullscreen button for single-page PDFs */}
            {numPages === 1 && (
              <Button
                size="lg"
                onClick={handleExit}
                className="bg-red-600 hover:bg-red-700 text-white font-sans font-medium rounded-lg px-6 py-3 transition-colors mt-4"
              >
                <ArrowLeft className="inline w-5 h-5 mr-2" /> Back to Lessons
              </Button>
            )}
          </div>
        </div>
      )}
      {/* Fullscreen mode */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onContextMenu={e => e.preventDefault()}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="text-lg text-gray-300">Loading PDF...</div>
              </div>
            }
            error={
              <div className="flex items-center justify-center p-8">
                <div className="text-lg text-red-500">
                  Failed to load PDF: {error || 'Unknown error'}
                </div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              height={window.innerHeight * 0.98}
              onLoadSuccess={onPageLoadSuccess}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
          {/* Draggable navigation bar */}
          <div
            ref={navBarRef}
            className="fixed z-50 bg-white/90 rounded-xl shadow-lg flex items-center space-x-4 px-6 py-3 cursor-move select-none"
            style={navBarPos ? { left: navBarPos.x, top: navBarPos.y, right: 'auto', bottom: 'auto', transform: 'none' } : { left: '50%', bottom: '2rem', transform: 'translateX(-50%)' }}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
          >
            <Button
              size="lg"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="bg-red-600 hover:bg-red-700 text-white font-sans font-medium rounded-lg px-6 py-3 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
            >
              Previous
            </Button>
            <span className="font-sans font-medium text-gray-800 select-none">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              size="lg"
              onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
              disabled={pageNumber >= (numPages || 1)}
              className="bg-red-600 hover:bg-red-700 text-white font-sans font-medium rounded-lg px-6 py-3 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
            >
              Next
            </Button>
            <Button
              size="lg"
              onClick={handleExit}
              className="bg-red-600 hover:bg-red-700 text-white font-sans font-medium rounded-lg px-6 py-3 transition-colors"
            >
              <ArrowLeft className="inline w-5 h-5 mr-2" /> Back to Lessons
            </Button>
            {/* Reset Position Button */}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setNavBarPos(null); }}
              className="ml-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors focus:outline-none"
              title="Reset Position"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
          </div>
        )}
    </div>
  );
} 