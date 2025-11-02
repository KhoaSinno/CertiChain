'use client';

import { Button } from '@/src/components/ui/button';
import { FileText, Image as ImageIcon, RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

  console.log('FilePreview - File info:', {
    name: file.name,
    type: file.type,
    size: file.size,
    isPDF,
    isImage
  });

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
    }
  }, [file, isImage]);

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
          className="h-8 w-8 p-0 bg-background/80 hover:bg-background border border-border/50 shadow-sm"
          title="Chọn file khác"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onRemove}
          className="h-8 w-8 p-0 bg-destructive/80 hover:bg-destructive shadow-sm"
          title="Xóa file"
        >
          <X className="h-3 w-3" />
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
            <div className="flex flex-col items-center justify-center text-center py-8">
              <FileText className="h-16 w-16 text-primary mb-4" />
              <p className="text-sm font-medium text-foreground">PDF Preview</p>
              <p className="text-xs text-muted-foreground mt-1">Không thể xem trước PDF</p>
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