import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { QRCodeModal } from './components/QRCodeModal';
import { ExportGuideModal } from './components/ExportGuideModal';
import { exportResponsesToCSV } from './utils/csvExport';
import { SurveyResponse } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'survey' | 'dashboard' | 'code-guide'>('dashboard');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [liveToast, setLiveToast] = useState<string | null>(null);

  // Theme state: defaults to Vibrant Light mode as requested, with instant toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_theme');
      if (saved) return saved === 'dark';
    }
    return false; // Default to colorful Vibrant Light!
  });

  // Sync theme with html root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Check URL parameter for ?mode=survey or ?mode=dashboard
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'survey') {
      setCurrentTab('survey');
    } else if (mode === 'dashboard') {
      setCurrentTab('dashboard');
    }
  }, []);

  // Fetch initial responses from server
  const fetchResponses = useCallback(async () => {
    try {
      const res = await fetch('/api/responses');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setResponses(json.data);
      }
    } catch (err) {
      console.warn('Could not fetch survey responses:', err);
    }
  }, []);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  // Connect to SSE for real-time synchronization
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.onopen = () => {
          setIsRealtimeConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_RESPONSE' && data.data) {
              setResponses((prev) => [data.data, ...prev]);
              showToast('✨ ได้รับแบบประเมินความพึงพอใจใหม่แบบเรียลไทม์!');
            } else if (data.type === 'RESET') {
              setResponses([]);
              showToast('🗑️ ข้อมูลการประเมินถูกรีเซ็ตแล้ว');
            } else if (data.type === 'SEED' && Array.isArray(data.data)) {
              setResponses(data.data);
              showToast('🔄 โหลดข้อมูลตัวอย่างเรียบร้อยแล้ว');
            }
          } catch (e) {
            console.error('Failed to parse SSE payload', e);
          }
        };

        eventSource.onerror = () => {
          setIsRealtimeConnected(false);
          eventSource?.close();
          reconnectTimeout = setTimeout(connectSSE, 3000);
        };
      } catch (err) {
        setIsRealtimeConnected(false);
        reconnectTimeout = setTimeout(connectSSE, 3000);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  const showToast = (msg: string) => {
    setLiveToast(msg);
    setTimeout(() => {
      setLiveToast(null);
    }, 3500);
  };

  const handleClearData = async () => {
    try {
      const res = await fetch('/api/responses', { method: 'DELETE' });
      if (res.ok) {
        setResponses([]);
        showToast('ล้างข้อมูลคำตอบทั้งหมดเรียบร้อยแล้ว');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedData = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setResponses(json.data);
        showToast('โหลดข้อมูลตัวอย่างเรียบร้อยแล้ว');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateResponse = async () => {
    const sampleFeedbacks = [
      'ประทับใจวิทยากรมาก ยกตัวอย่างการใช้งานจริงเห็นภาพชัดเจน',
      'เนื้อหาดีมาก อยากให้จัดหลักสูตร 2 วันเต็มเลยครับ',
      'ชอบ Workshop ได้ลงมือทำจริง ขอบคุณทีมงานทุกคนครับ',
      'เอกสารสไลด์ทำได้ดีมาก ตอบคำถามได้เคลียร์ทุกข้อ',
      'ได้เทคนิคใหม่ๆ นำไปใช้ในงานประจำวันพรุ่งนี้ได้เลย',
    ];

    const randomScores = [
      Math.floor(Math.random() * 2) + 4, // 4 or 5
      5,
      Math.floor(Math.random() * 2) + 4,
      Math.floor(Math.random() * 2) + 4,
      5,
    ];

    const payload = {
      q1: randomScores[0],
      q2: randomScores[1],
      q3: randomScores[2],
      q4: randomScores[3],
      q5: randomScores[4],
      feedback: sampleFeedbacks[Math.floor(Math.random() * sampleFeedbacks.length)],
      deviceFingerprint: `sim_${Date.now()}`,
    };

    try {
      await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-pink-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Toast Notification */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-indigo-500/40 text-slate-900 dark:text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs sm:text-sm font-bold">{liveToast}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenQR={() => setIsQRModalOpen(true)}
        onExportCSV={() => exportResponsesToCSV(responses)}
        totalResponses={responses.length}
        isRealtimeConnected={isRealtimeConnected}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Page Content */}
      <main className="flex-1 pb-16">
        {currentTab === 'survey' && (
          <SurveyView
            onSubmitSuccess={(newRes) => {
              setResponses((prev) => [newRes, ...prev]);
            }}
            onGoToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            responses={responses}
            onOpenQR={() => setIsQRModalOpen(true)}
            onExportCSV={() => exportResponsesToCSV(responses)}
            onClearData={handleClearData}
            onSeedData={handleSeedData}
            onSimulateResponse={handleSimulateResponse}
            isRealtimeConnected={isRealtimeConnected}
          />
        )}

        {currentTab === 'code-guide' && <ExportGuideModal />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ระบบแบบสอบถามความพึงพอใจการอบรม • คำนวณเกณฑ์ 5 ระดับ Likert Scale และกราฟวงกลมเรียลไทม์</span>
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-semibold">
            <button
              onClick={() => setCurrentTab('code-guide')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              คู่มือตั้งค่า Firebase
            </button>
            <span>•</span>
            <button
              onClick={() => exportResponsesToCSV(responses)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              ส่งออก CSV
            </button>
          </div>
        </div>
      </footer>

      {/* Big Screen QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
}
