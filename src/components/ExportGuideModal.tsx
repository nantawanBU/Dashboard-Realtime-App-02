import React, { useState } from 'react';
import {
  FileCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Settings,
  ShieldCheck,
  Globe,
  Database,
  Terminal,
  Layers,
  Sparkles,
} from 'lucide-react';
import { generateSurveyHtml, generateDashboardHtml } from '../utils/firebaseTemplates';
import { FirebaseConfigState } from '../types';

export const ExportGuideModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide' | 'config'>('guide');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);

  // User-customizable Firebase Config
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfigState>({
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  const surveyHtml = generateSurveyHtml(firebaseConfig);
  const dashboardHtml = generateDashboardHtml(firebaseConfig);

  const handleCopy = (type: 'survey' | 'dashboard') => {
    const text = type === 'survey' ? surveyHtml : dashboardHtml;
    navigator.clipboard.writeText(text);
    if (type === 'survey') {
      setCopiedSurvey(true);
      setTimeout(() => setCopiedSurvey(false), 2000);
    } else {
      setCopiedDashboard(true);
      setTimeout(() => setCopiedDashboard(false), 2000);
    }
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadBoth = () => {
    handleDownload('survey.html', surveyHtml);
    setTimeout(() => {
      handleDownload('dashboard.html', dashboardHtml);
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-bold mb-2">
              <FileCode className="w-3.5 h-3.5 text-cyan-200" />
              <span>HTML + JavaScript + Firebase Realtime Database</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ซอร์สโค้ดแยก 2 ไฟล์ & คู่มือติดตั้ง Firebase ทีละขั้นตอน
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl leading-relaxed">
              โค้ดแยก 2 ไฟล์เดี่ยวพร้อมใช้งาน (Standalone HTML) โดยไม่ต้องใช้เซิร์ฟเวอร์
              ทำงานแบบเรียลไทม์ผ่าน Firebase Realtime Database แพ็กเกจฟรี 100% (Spark Plan)
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleDownloadBoth}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-blue-50 font-black text-sm flex items-center justify-center gap-2 shadow-xl transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดทั้ง 2 ไฟล์ (.html)</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/20">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'guide'
                ? 'bg-white text-indigo-900 shadow'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 คู่มือตั้งค่า Firebase & Deploy</span>
          </button>

          <button
            onClick={() => setActiveTab('survey')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'survey'
                ? 'bg-white text-indigo-900 shadow'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>📄 ไฟล์ที่ 1: survey.html</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'dashboard'
                ? 'bg-white text-indigo-900 shadow'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>📄 ไฟล์ที่ 2: dashboard.html</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'config'
                ? 'bg-white text-indigo-900 shadow'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ กรอก Firebase Config ส่วนตัว</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Step-by-Step Deployment Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Step 1: Create Project */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 font-black text-lg flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    สร้าง Firebase Project (ฟรี 100% บน Spark Plan)
                  </h3>
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
                  >
                    <span>เปิด Firebase Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  1. เข้าสู่ <strong className="text-slate-900 dark:text-white">console.firebase.google.com</strong> ด้วยบัญชี Google
                  <br />
                  2. คลิก <strong className="text-slate-900 dark:text-white">"Add project"</strong> (สร้างโปรเจกต์)
                  <br />
                  3. ตั้งชื่อโปรเจกต์ เช่น <code className="bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded text-blue-600 dark:text-blue-300 font-bold">training-survey-live</code> แล้วคลิก Continue
                  <br />
                  4. ส่วนของ Google Analytics สามารถเลือกเปิดหรือปิดก็ได้ จากนั้นกด <strong className="text-slate-900 dark:text-white">"Create project"</strong> รอ 10-15 วินาที
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Realtime Database Setup */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-black text-lg flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  เปิดใช้งาน Realtime Database & ตั้งค่า Security Rules
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  1. ที่แถบเมนูด้านซ้ายในหน้า Firebase Console ให้ไปที่ <strong className="text-slate-900 dark:text-white">Build &gt; Realtime Database</strong>
                  <br />
                  2. คลิกปุ่ม <strong className="text-slate-900 dark:text-white">"Create Database"</strong>
                  <br />
                  3. ในช่อง Realtime Database location ให้เลือก <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Singapore (asia-southeast1)</strong> เพื่อให้การเชื่อมต่อจากไทยเร็วที่สุด หรือเลือก United States ก็ได้
                  <br />
                  4. ในหน้า Security rules ให้เลือก <strong className="text-amber-600 dark:text-amber-300 font-bold">"Start in test mode"</strong> หรือเมื่อสร้างเสร็จแล้วไปที่แท็บ <strong className="text-slate-900 dark:text-white">Rules</strong> แล้วตั้งค่าตามนี้:
                </p>

                {/* Rules Code Snippet */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-400 relative">
                  <pre>{`{
  "rules": {
    "responses": {
      ".read": true,
      ".write": true
    }
  }
}`}</pre>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  💡 กฎนี้อนุญาตให้ผู้เข้าอบรมส่งคำตอบและเปิดดู Dashboard ได้ทันทีโดยไม่ต้องล็อกอิน (Anonymous) ตามข้อกำหนด Constraints ของคุณ
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Get Firebase Config */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 font-black text-lg flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  คัดลอกค่า Firebase Config มาวางในโค้ด
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  1. คลิกไอคอนรูปฟันเฟือง <strong className="text-slate-900 dark:text-white">Project Settings</strong> ที่มุมซ้ายบน
                  <br />
                  2. เลื่อนลงมาที่หัวข้อ <strong className="text-slate-900 dark:text-white">"Your apps"</strong> แล้วคลิกไอคอนเว็บ <strong className="text-blue-600 dark:text-blue-400">&lt;/&gt;</strong>
                  <br />
                  3. ตั้งชื่อแอป เช่น <code className="bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded text-blue-600 dark:text-blue-300 font-bold">survey-app</code> แล้วกด Register app
                  <br />
                  4. ท่านจะได้รับชุดโค้ด <code className="text-amber-600 dark:text-amber-300 font-bold">firebaseConfig = &#123; ... &#125;</code>
                  <br />
                  5. นำค่าดังกล่าวมาวางในตัวแปร <code className="text-blue-600 dark:text-blue-400">firebaseConfig</code> ในทั้ง 2 ไฟล์ (<code className="text-slate-900 dark:text-white">survey.html</code> และ <code className="text-slate-900 dark:text-white">dashboard.html</code>) หรือกรอกในแท็บ <strong>"⚙️ กรอก Firebase Config ส่วนตัว"</strong> ในหน้านี้แล้วดาวน์โหลดได้ทันที!
                </p>
              </div>
            </div>
          </div>

          {/* Step 4: Deploy for Free */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-black text-lg flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  วิธี Deploy ออนไลน์ฟรี 100% เพื่อให้ผู้เข้าร่วมอบรมสแกนได้จริง
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Option 1: GitHub Pages */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>วิธีที่ 1: GitHub Pages</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 inline-block font-bold">
                      ง่ายที่สุด ไม่ต้องลงโปรแกรม
                    </span>
                    <ol className="list-decimal list-inside text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
                      <li>สร้าง Repo บน GitHub</li>
                      <li>เปลี่ยนชื่อ <code className="text-amber-600 dark:text-amber-300">survey.html</code> เป็น <code className="text-amber-600 dark:text-amber-300">index.html</code></li>
                      <li>อัปโหลด <code className="text-slate-900 dark:text-white">index.html</code> และ <code className="text-slate-900 dark:text-white">dashboard.html</code></li>
                      <li>ไปที่ Settings &gt; Pages &gt; Source เลือก Branch <code className="text-slate-900 dark:text-white">main</code></li>
                      <li>ได้ URL สดให้ผู้ฟังตอบทันที!</li>
                    </ol>
                  </div>

                  {/* Option 2: Firebase Hosting */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                      <Terminal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>วิธีที่ 2: Firebase Hosting</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 inline-block font-bold">
                      เร็วระดับ CDN ฟรี
                    </span>
                    <ol className="list-decimal list-inside text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
                      <li>รัน <code className="text-slate-900 dark:text-white">npm i -g firebase-tools</code></li>
                      <li>รัน <code className="text-slate-900 dark:text-white">firebase login</code></li>
                      <li>รัน <code className="text-slate-900 dark:text-white">firebase init hosting</code></li>
                      <li>วาง 2 ไฟล์ลงในโฟลเดอร์ <code className="text-slate-900 dark:text-white">public</code></li>
                      <li>รันคำสั่ง <code className="text-slate-900 dark:text-white">firebase deploy</code></li>
                    </ol>
                  </div>

                  {/* Option 3: Netlify / Vercel */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                      <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>วิธีที่ 3: Netlify Drop</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 inline-block font-bold">
                      ลากวางได้ทันทีใน 10 วินาที
                    </span>
                    <ol className="list-decimal list-inside text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
                      <li>สร้างโฟลเดอร์ใส่ทั้ง 2 ไฟล์</li>
                      <li>เข้า <code className="text-slate-900 dark:text-white">app.netlify.com/drop</code></li>
                      <li>ลากโฟลเดอร์ลงไปวาง</li>
                      <li>ระบบจะสร้างลิงก์เว็บไซต์ให้ทันที</li>
                      <li>นำ URL ไปสร้าง QR Code บนสไลด์!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: survey.html Viewer */}
      {activeTab === 'survey' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">ไฟล์ survey.html (หน้าตอบแบบสอบถาม)</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Mobile-First
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ปุ่มสเกล 1-5 กดง่าย • ตรวจสอบกันตอบซ้ำด้วย localStorage • ส่งเข้า Firebase ทันที
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('survey')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              >
                {copiedSurvey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSurvey ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
              </button>

              <button
                onClick={() => handleDownload('survey.html', surveyHtml)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด survey.html</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto max-h-[550px] scrollbar-thin">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed">
              <code>{surveyHtml}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: dashboard.html Viewer */}
      {activeTab === 'dashboard' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">ไฟล์ dashboard.html (หน้า Dashboard จอโปรเจกเตอร์)</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Real-time Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                กราฟ Chart.js • เกณฑ์ 5 ระดับ Likert • กราฟแท่งรายข้อ • ข้อเสนอแนะสด • QR Code และส่งออก CSV
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('dashboard')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              >
                {copiedDashboard ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedDashboard ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
              </button>

              <button
                onClick={() => handleDownload('dashboard.html', dashboardHtml)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด dashboard.html</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto max-h-[550px] scrollbar-thin">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed">
              <code>{dashboardHtml}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: Personal Firebase Config Customizer */}
      {activeTab === 'config' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              ปรับแต่ง Firebase Config ของคุณ (ใส่แล้วไฟล์จะอัปเดตอัตโนมัติ)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              หากท่านมี Firebase Project อยู่แล้ว สามารถนำค่ามาใส่ที่นี่ แล้วกดดาวน์โหลดไฟล์ด้านบนได้ทันทีโดยไม่ต้องแก้โค้ดเอง
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">apiKey</label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={firebaseConfig.apiKey}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">authDomain</label>
              <input
                type="text"
                placeholder="my-project.firebaseapp.com"
                value={firebaseConfig.authDomain}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">
                databaseURL <span className="text-amber-400">(สำคัญที่สุดสำหรับ Realtime Database)</span>
              </label>
              <input
                type="text"
                placeholder="https://my-project-default-rtdb.asia-southeast1.firebasedatabase.app"
                value={firebaseConfig.databaseURL}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, databaseURL: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">projectId</label>
              <input
                type="text"
                placeholder="my-project"
                value={firebaseConfig.projectId}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">appId</label>
              <input
                type="text"
                placeholder="1:1234567890:web:abcdef123"
                value={firebaseConfig.appId}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              ✨ โค้ดในแท็บ survey.html และ dashboard.html จะใช้ค่าที่คุณกรอกนี้ทันที
            </span>
            <button
              onClick={handleDownloadBoth}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดไฟล์ที่ใส่ Config แล้ว</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
