import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Smartphone,
  FileCode,
  QrCode,
  Download,
  Maximize,
  Minimize,
  Radio,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'survey' | 'dashboard' | 'code-guide';
  setCurrentTab: (tab: 'survey' | 'dashboard' | 'code-guide') => void;
  onOpenQR: () => void;
  onExportCSV: () => void;
  totalResponses: number;
  isRealtimeConnected: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenQR,
  onExportCSV,
  totalResponses,
  isRealtimeConnected,
  isDarkMode,
  onToggleTheme,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 dark:text-white text-base tracking-tight hidden sm:inline">
                  Survey & Realtime Dashboard
                </span>
                <span className="font-black text-slate-900 dark:text-white text-base tracking-tight sm:hidden">
                  Survey Live
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    isRealtimeConnected
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                  }`}
                  title={isRealtimeConnected ? 'Real-time SSE เชื่อมต่อแล้ว' : 'กำลังซิงค์ข้อมูล'}
                >
                  <Radio className={`w-3 h-3 ${isRealtimeConnected ? 'animate-pulse text-emerald-500' : ''}`} />
                  <span className="hidden xs:inline">{isRealtimeConnected ? 'LIVE' : 'SYNCING'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 hidden md:block">
                ระบบประเมินความพึงพอใจการอบรม • กราฟวงกลมและเกณฑ์ 5 ระดับเรียลไทม์
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-100 dark:bg-slate-950/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            <button
              onClick={() => setCurrentTab('survey')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                currentTab === 'survey'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>หน้าตอบแบบสอบถาม</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                currentTab === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard กราฟวงกลม</span>
              {totalResponses > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-black">
                  {totalResponses}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('code-guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                currentTab === 'code-guide'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span className="hidden md:inline">โค้ด 2 ไฟล์ & คู่มือ Firebase</span>
              <span className="md:hidden">คู่มือ & โค้ด</span>
            </button>
          </nav>

          {/* Actions & Theme Switcher */}
          <div className="flex items-center gap-2">
            {/* Vibrant Theme Switcher */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-indigo-500/10 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
              title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่างสดใส (Vibrant Light)' : 'เปลี่ยนเป็นธีมนีออน (Vibrant Dark)'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="hidden lg:inline">ธีมสว่างสดใส</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden lg:inline">ธีมนีออน</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenQR}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-400 border border-blue-500/30 font-bold text-xs sm:text-sm transition"
              title="เปิด QR Code สแกนตอบบนจอยักษ์"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Code จอใหญ่</span>
            </button>

            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs sm:text-sm transition"
              title="ส่งออกผลคะแนนเป็นไฟล์ CSV (รองรับ Excel ภาษาไทย)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition"
              title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'แสดงผลเต็มจอโปรเจกเตอร์'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
