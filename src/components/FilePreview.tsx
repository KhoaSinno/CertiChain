'use client';

import { Button } from '@/src/components/ui/button';
import { FileText, Image as ImageIcon, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Dynamic import PDF.js only on client-side
let pdfjs: typeof import('pdfjs-dist') | null = null;

// Initialize PDF.js worker only on client-side
const initializePdfJs = async () => {
  if (typeof window !== 'undefined' && !pdfjs) {
    pdfjs = await import('pdfjs-dist');
    // Use legacy worker to avoid DOMMatrix issues
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.legacy.min.mjs';
  }
  return pdfjs;
};

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  onReplace: () => void;
  className?: string;
}

export function FilePreview({ file, onRemove, onReplace, className = "" }: FilePreviewProps) {
  const isPDF = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [pdfThumbnail, setPdfThumbnail] = useState<string>('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

  console.log('FilePreview - File info:', {
    name: file.name,
    type: file.type,
    size: file.size,
    isPDF,
    isImage
  });

  // Generate real PDF thumbnail using PDF.js
  const generatePdfThumbnail = useCallback(async () => {
    try {
      setIsGeneratingThumbnail(true);
      console.log('Starting PDF thumbnail generation...');
      
      // Initialize PDF.js dynamically
      const pdfjsLib = await initializePdfJs();
      if (!pdfjsLib) {
        throw new Error('Failed to initialize PDF.js');
      }
      
      console.log('PDF.js version:', pdfjsLib.version);
      console.log('Worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);
      
      // Convert file to ArrayBuffer
      console.log('Converting file to ArrayBuffer...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('ArrayBuffer size:', arrayBuffer.byteLength);
      
      // Load PDF document
      console.log('Loading PDF document...');
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer
      });
      
      const pdf = await loadingTask.promise;
      console.log('PDF loaded successfully');
      
      // Get first page
      console.log('Getting first page...');
      const page = await pdf.getPage(1);
      console.log('Page loaded');
      
      // Set up canvas with proper scale
      const scale = 1.0; // Start with smaller scale for testing
      const viewport = page.getViewport({ scale });
      console.log('Viewport size:', viewport.width, 'x', viewport.height);
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Limit canvas size to prevent memory issues
      const maxWidth = 400;
      const maxHeight = 600;
      const actualScale = Math.min(
        maxWidth / viewport.width,
        maxHeight / viewport.height,
        scale
      );
      
      const scaledViewport = page.getViewport({ scale: actualScale });
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      
      console.log('Canvas size:', canvas.width, 'x', canvas.height);
      
      if (context) {
        // Set white background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Render page to canvas
        console.log('Rendering page to canvas...');
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
          canvas: canvas,
        };
        
        await page.render(renderContext).promise;
        console.log('Page rendered successfully');
        
        // Convert to data URL
        const thumbnailDataUrl = canvas.toDataURL('image/png', 0.8);
        setPdfThumbnail(thumbnailDataUrl);
        console.log('PDF thumbnail generated successfully, size:', thumbnailDataUrl.length);
      } else {
        throw new Error('Could not get canvas context');
      }
    } catch (error) {
      console.error('Error generating PDF thumbnail:', error);
      console.error('Error details:', error);
      
      // Fallback: create a simple PDF icon preview
      console.log('Creating fallback PDF preview...');
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 400;
        
        if (ctx) {
          // White background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Border
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 2;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
          
          // PDF icon area
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(20, 20, canvas.width - 40, 60);
          
          // "PDF" text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('PDF', canvas.width / 2, 55);
          
          // Document lines
          ctx.fillStyle = '#6b7280';
          for (let i = 0; i < 12; i++) {
            const y = 100 + i * 20;
            const width = Math.random() * 120 + 100;
            ctx.fillRect(40, y, width, 6);
          }
          
          const fallbackDataUrl = canvas.toDataURL('image/png');
          setPdfThumbnail(fallbackDataUrl);
          console.log('Fallback PDF preview created');
        }
      } catch (fallbackError) {
        console.error('Even fallback failed:', fallbackError);
        setPdfThumbnail('');
      }
    } finally {
      setIsGeneratingThumbnail(false);
    }
  }, [file]);

  // Create preview URL for images using FileReader
  useEffect(() => {
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          console.log('FileReader loaded data URL');
          setPreviewUrl(result);
        }
      };
      reader.onerror = () => {
        console.error('FileReader error');
      };
      reader.readAsDataURL(file);
    } else if (isPDF) {
      // Generate PDF thumbnail
      generatePdfThumbnail();
    }
  }, [file, isImage, isPDF, generatePdfThumbnail]);

  // No cleanup needed for data URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        console.log('Cleaning up preview URL');
        setPreviewUrl('');
      }
    };
  }, [previewUrl]);

  return (
    <div className={`relative border-2 border-primary/30 rounded-lg bg-background/60 backdrop-blur-sm p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${className}`}>
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onReplace}
          className="h-8 w-8 p-0 bg-white hover:bg-gray-100 border border-gray-300 shadow-xl transition-all duration-200 hover:scale-105"
          title="Chọn file khác"
        >
          <RotateCcw className="h-3 w-3 text-gray-700" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onRemove}
          className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 shadow-xl transition-all duration-200 hover:scale-105"
          title="Xóa file"
        >
          <X className="h-3 w-3 text-white" />
        </Button>
      </div>

      {/* Preview Content */}
      <div className="space-y-3">
        {/* Preview Area */}
        <div className="min-h-[200px] flex items-center justify-center bg-muted/30 rounded-lg border border-border/30">
          {isImage && previewUrl ? (
            <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-[300px] object-contain rounded-md shadow-sm"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onLoad={() => {
                  console.log('Image loaded successfully:', previewUrl);
                }}
                onError={(e) => {
                  console.error('Failed to load image preview:', e);
                  console.error('Preview URL:', previewUrl);
                }}
              />
            </div>
          ) : isPDF ? (
            <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
              {isGeneratingThumbnail ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="text-sm font-medium text-foreground">Đang tạo thumbnail...</p>
                </div>
              ) : pdfThumbnail ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pdfThumbnail}
                    alt="PDF Thumbnail"
                    className="max-w-full max-h-[300px] object-contain rounded-md shadow-lg border border-border/20"
                  />
                  <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                    PDF
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <FileText className="h-16 w-16 text-primary mb-4" />
                  <p className="text-sm font-medium text-foreground">PDF Thumbnail</p>
                  <p className="text-xs text-muted-foreground mt-1">Đang tạo thumbnail...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground">File Preview</p>
              <p className="text-xs text-muted-foreground mt-1">Không thể xem trước file này</p>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="space-y-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-2">
            {isPDF ? (
              <FileText className="h-4 w-4 text-primary" />
            ) : (
              <ImageIcon className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Kích thước: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
            <span>Loại: {file.type || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}