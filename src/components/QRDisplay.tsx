'use client';

import { useState } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Copy, Share2 } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface QRDisplayProps {
  value: string;
  title?: string;
  description?: string;
  size?: number;
  className?: string;
}

export function QRDisplay({ 
  value, 
  title = "Mã QR chứng chỉ",
  description = "Quét mã QR để xác minh chứng chỉ",
  size = 200,
  className = ""
}: QRDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(value);
      // You can add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Get the QR code canvas element
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `certificate-qr-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Failed to download:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chứng chỉ CertiChain',
          text: 'Xác minh chứng chỉ của tôi',
          url: value,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      // Fallback to copy
      await handleCopy();
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* QR Code */}
        <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-dashed border-muted">
          <QRCode
            value={value}
            size={size}
            level="M"
            includeMargin={true}
            renderAs="canvas"
          />
        </div>

        {/* URL Display */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Link xác minh</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <code className="text-xs text-muted-foreground break-all block">
            {value}
          </code>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Đang tải...' : 'Tải xuống'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Nhà tuyển dụng có thể quét mã QR này để xác minh chứng chỉ
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
