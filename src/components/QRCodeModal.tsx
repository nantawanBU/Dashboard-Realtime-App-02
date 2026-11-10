import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, ExternalLink, Smartphone, Sparkles } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, surveyUrl }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute effective survey URL
  const effectiveUrl =
    surveyUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}?mode=survey`
      : 'https://ais-training-survey.app');

  useEffect(() => {
    if (!isOpen) return;

    // Generate high resolution QR Code
    QRCode.toDataURL(effectiveUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [isOpen, effectiveUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(effectiveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'training_survey_qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
          <Smartphone className="w-3.5 h-3.5" />
          <span>สแกนตอบผ่านมือถือ</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
          สแกน QR Code เพื่อทำแบบสอบถาม
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
          เปิดกล้องบนมือถือแล้วส่องที่รูป QR ด้านล่าง ไม่ต้องดาวน์โหลดแอป ไม่ต้องล็อกอิน
        </p>

        {/* Giant Crisp White QR Code Container (Optimized for Projector) */}
        <div className="relative mx-auto inline-block p-4 sm:p-5 bg-white rounded-3xl shadow-2xl ring-8 ring-blue-500/20 mb-6 border border-slate-200">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Scan Survey QR Code"
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-sm">
              กำลังสร้าง QR Code...
            </div>
          )}
        </div>

        {/* Copy URL Box */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 mb-4">
          <input
            type="text"
            readOnly
            value={effectiveUrl}
            className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none select-all font-mono truncate font-semibold"
          />
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={handleDownload}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>บันทึกรูป QR Code (PNG)</span>
          </button>

          <a
            href={effectiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow"
          >
            <ExternalLink className="w-4 h-4" />
            <span>เปิดหน้าตอบในแท็บใหม่</span>
          </a>
        </div>
      </div>
    </div>
  );
};
