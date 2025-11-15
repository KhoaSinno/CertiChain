"use client";

import { Button } from "@/src/components/ui/button";
import { Certificate } from "@/src/types/certificate";
import { Download, Share2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
interface CertificateDisplayProps {
  certificate: Certificate;
  verificationUrl?: string;
}

export function CertificateDisplay({
  certificate,
  verificationUrl,
}: CertificateDisplayProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handleShare = () => {
    if (navigator.share && verificationUrl) {
      navigator.share({
        title: `Chứng chỉ ${certificate.courseName}`,
        text: `Chứng chỉ ${certificate.courseName} của ${
          certificate.student?.studentName || "N/A"
        }`,
        url: verificationUrl,
      });
    }
  };

  return (
    <div className="w-full">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-end mb-6">
        <Button
          variant="outline"
          className="gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <Download className="h-4 w-4" />
          Tải PDF
        </Button>

        {verificationUrl && (
          <Button
            variant="outline"
            onClick={handleShare}
            className="gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
        )}
      </div>

      {/* Certificate Display - Print styling */}
      <div className="hidden print:block">
        <style jsx>{`
          @media print {
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
        `}</style>
      </div>

      {/* Certificate Content */}
      <div
        ref={componentRef}
        className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-8 border-blue-900 rounded-2xl shadow-2xl overflow-hidden relative mx-auto my-0 py-7.5 px-12.5"
        style={{
          width: "297mm", // A4 landscape width
          minHeight: "210mm", // A4 landscape height
        }}
      >
        {/* Guilloche Pattern Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
          >
            <defs>
              {/* Guilloche pattern */}
              <pattern
                id="guilloche"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="2"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                />
                <path
                  d="M 10 50 Q 50 10, 90 50 T 10 50"
                  stroke="#1e40af"
                  strokeWidth="0.3"
                  fill="none"
                />
                <path
                  d="M 10 50 Q 50 90, 90 50 T 10 50"
                  stroke="#1e40af"
                  strokeWidth="0.3"
                  fill="none"
                />
              </pattern>

              {/* Wave lines pattern */}
              <pattern
                id="waves"
                x="0"
                y="0"
                width="200"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 25 Q 50 15, 100 25 T 200 25"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M 0 25 Q 50 35, 100 25 T 200 25"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.3"
                />
              </pattern>

              {/* Diagonal lines */}
              <pattern
                id="diagonal"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="50"
                  y2="50"
                  stroke="#1e40af"
                  strokeWidth="0.2"
                  opacity="0.2"
                />
              </pattern>
            </defs>

            {/* Apply patterns */}
            <rect width="100%" height="100%" fill="url(#guilloche)" />
            <rect width="100%" height="100%" fill="url(#waves)" />
            <rect width="100%" height="100%" fill="url(#diagonal)" />

            {/* Decorative corners */}
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke="#1e40af"
              strokeWidth="1"
              opacity="0.2"
            />
            <circle
              cx="calc(100% - 20)"
              cy="20"
              r="15"
              fill="none"
              stroke="#1e40af"
              strokeWidth="1"
              opacity="0.2"
            />
            <circle
              cx="20"
              cy="calc(100% - 20)"
              r="15"
              fill="none"
              stroke="#1e40af"
              strokeWidth="1"
              opacity="0.2"
            />
            <circle
              cx="calc(100% - 20)"
              cy="calc(100% - 20)"
              r="15"
              fill="none"
              stroke="#1e40af"
              strokeWidth="1"
              opacity="0.2"
            />

            {/* Border decorations */}
            <rect
              x="10"
              y="10"
              width="30"
              height="3"
              fill="#1e40af"
              opacity="0.3"
            />
            <rect
              x="calc(100% - 40)"
              y="10"
              width="30"
              height="3"
              fill="#1e40af"
              opacity="0.3"
            />
            <rect
              x="10"
              y="calc(100% - 13)"
              width="30"
              height="3"
              fill="#1e40af"
              opacity="0.3"
            />
            <rect
              x="calc(100% - 40)"
              y="calc(100% - 13)"
              width="30"
              height="3"
              fill="#1e40af"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Content wrapper with z-index */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-3 w-3 bg-blue-900 rounded-full"></div>
              <div className="h-3 w-3 bg-blue-900 rounded-full"></div>
              <div className="h-3 w-3 bg-blue-900 rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold text-blue-900 mb-3">
              CHỨNG CHỈ HOÀN THÀNH
            </h1>
            <h2 className="text-2xl font-semibold text-blue-700">
              CERTIFICATE OF COMPLETION
            </h2>
          </div>

          {/* Decorative Border */}
          <div className="border-t-4 border-blue-900 my-4"></div>

          {/* Main Content */}
          <div className="text-center mb-6">
            <p className="text-xl">
              Hội đồng công nhận chứng chỉ CertiChain xác nhận rằng
            </p>

            <div className="my-3">
              <h3 className="text-6xl font-bold text-blue-900 tracking-wide">
                {certificate.student?.studentName?.toUpperCase() || "N/A"}
              </h3>
              <p className="text-xl text-blue-900 font-medium">
                Mã sinh viên: {certificate.student?.studentId?.toUpperCase() || "N/A"}
              </p>
            </div>

            <p className="text-xl my-4 font-medium"><i>- Đã Hoàn Thành Khóa Học -</i></p>

            <h4 className="text-4xl font-bold text-blue-700 mb-6 px-12">
              {certificate.courseName}
            </h4>
          </div>

          {/* Footer - Compact layout */}
          <div className="mt-auto">
            <div className="border-t-4 border-blue-900 pt-6">
              <div className="flex items-center justify-between">
                {/* Left - Issuer */}
                <div className="flex-1 text-left">
                  <div className="border-b-2 border-blue-900 mb-2 w-32"></div>
                  <p className="text-sm font-semibold text-gray-700">
                    NGƯỜI PHÁT HÀNH
                  </p>
                  {certificate.issuerAddress && (
                    <p className="text-xs text-gray-600 mt-1 font-mono">
                      {certificate.issuerAddress}
                    </p>
                  )}
                </div>

                {/* Center - QR Code */}
                {verificationUrl && (
                  <div className="border-3 border-blue-900 p-2 bg-white flex-shrink-0">
                    <QRCodeCanvas
                      value={verificationUrl}
                      size={100}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                )}

                {/* Right - Issue Date */}
                <div className="flex-1 text-right">
                  <div className="border-b-2 border-blue-900 mb-2 w-32 ml-auto"></div>
                  <p className="text-sm font-semibold text-gray-700">
                    NGÀY XÁC THỰC
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {certificate.issuedAt.toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Verification URL and NFT Hash - 2 columns */}
              {(verificationUrl || certificate.mintTx) && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {/* Verification URL */}
                  {verificationUrl && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Xác minh tại:</p>
                      <a 
                        href={verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-blue-700 hover:text-blue-900 underline underline-offset-2 break-all inline-block transition-colors"
                      >
                        {verificationUrl}
                      </a>
                    </div>
                  )}

                  {/* NFT Hash */}
                  {certificate.mintTx && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">NFT Mint Transaction:</p>
                      <a 
                        href={`https://testnet.routescan.io/tx/${certificate.mintTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-purple-700 hover:text-purple-900 underline underline-offset-2 break-all inline-block transition-colors"
                      >
                        {certificate.mintTx}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CertiChain Badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Powered by{" "}
              <span className="font-bold text-blue-700">CertiChain</span> -
              Blockchain Verification System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
