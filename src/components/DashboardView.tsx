import React, { useState } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  QrCode,
  Download,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Trash2,
  PieChart as PieIcon,
  CircleDot,
} from 'lucide-react';
import { SurveyResponse } from '../types';
import { SURVEY_QUESTIONS, RATING_LEVELS, getInterpretation } from '../constants/surveyData';
import { CircularGauge, DonutDistributionChart } from './CircularCharts';

interface DashboardViewProps {
  responses: SurveyResponse[];
  onOpenQR: () => void;
  onExportCSV: () => void;
  onClearData: () => void;
  onSeedData: () => void;
  onSimulateResponse: () => void;
  isRealtimeConnected: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  responses,
  onOpenQR,
  onExportCSV,
  onClearData,
  onSeedData,
  onSimulateResponse,
  isRealtimeConnected,
}) => {
  const [showInterpretationGuide, setShowInterpretationGuide] = useState(false);
  const count = responses.length;

  // Calculate statistics
  const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
  const scoreCounts: { [key: string]: { [score: number]: number } } = {
    q1: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    q2: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    q3: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    q4: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    q5: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  // Aggregate distribution of all ratings across questions (or user overall ratings)
  const totalRatingDist: { [score: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let positiveCount = 0; // Average >= 4
  let totalScorePoints = 0;

  responses.forEach((r) => {
    const qScores = [r.q1, r.q2, r.q3, r.q4, r.q5];
    qScores.forEach((s, idx) => {
      const qKey = `q${idx + 1}` as keyof typeof sums;
      sums[qKey] += s;
      if (scoreCounts[qKey][s] !== undefined) {
        scoreCounts[qKey][s]++;
      }
      totalRatingDist[s] = (totalRatingDist[s] || 0) + 1;
    });

    const userAvg = (r.q1 + r.q2 + r.q3 + r.q4 + r.q5) / 5;
    totalScorePoints += userAvg;
    if (userAvg >= 4.0) {
      positiveCount++;
    }
  });

  const avgQ1 = count > 0 ? sums.q1 / count : 0;
  const avgQ2 = count > 0 ? sums.q2 / count : 0;
  const avgQ3 = count > 0 ? sums.q3 / count : 0;
  const avgQ4 = count > 0 ? sums.q4 / count : 0;
  const avgQ5 = count > 0 ? sums.q5 / count : 0;

  const averages = [avgQ1, avgQ2, avgQ3, avgQ4, avgQ5];
  const overallAvg = count > 0 ? totalScorePoints / count : 0;
  const overallInterp = getInterpretation(overallAvg);
  const positiveRate = count > 0 ? Math.round((positiveCount / count) * 100) : 0;

  // Filter feedback comments
  const feedbackList = responses.filter((r) => r.feedback && r.feedback.trim() !== '');

  // Slices for the Circular Donut Chart
  const donutSlices = [
    {
      score: 5,
      label: 'มากที่สุด',
      count: totalRatingDist[5] || 0,
      color: '#10b981',
      gradientColors: ['#10b981', '#14b8a6'] as [string, string],
      emoji: '🤩',
    },
    {
      score: 4,
      label: 'มาก',
      count: totalRatingDist[4] || 0,
      color: '#0ea5e9',
      gradientColors: ['#0284c7', '#06b6d4'] as [string, string],
      emoji: '😊',
    },
    {
      score: 3,
      label: 'ปานกลาง',
      count: totalRatingDist[3] || 0,
      color: '#f59e0b',
      gradientColors: ['#f59e0b', '#eab308'] as [string, string],
      emoji: '😐',
    },
    {
      score: 2,
      label: 'น้อย',
      count: totalRatingDist[2] || 0,
      color: '#f97316',
      gradientColors: ['#f97316', '#fb923c'] as [string, string],
      emoji: '🙁',
    },
    {
      score: 1,
      label: 'น้อยที่สุด',
      count: totalRatingDist[1] || 0,
      color: '#f43f5e',
      gradientColors: ['#f43f5e', '#e11d48'] as [string, string],
      emoji: '😞',
    },
  ];

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return 'เมื่อสักครู่';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} นาทีที่แล้ว`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ชั่วโมงที่แล้ว`;
      return new Date(isoString).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Vibrant Top Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Colorful ambient accent aura */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Dashboard ผลการประเมินความพึงพอใจการอบรม
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isRealtimeConnected
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{isRealtimeConnected ? 'LIVE ซิงค์สด' : 'กำลังเชื่อมต่อ'}</span>
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            แสดงผลกราฟวงกลมและสถิติสดทันทีที่มีคนส่ง • สีสันสดใส คมชัดสำหรับฉายขึ้นจอโปรเจกเตอร์
          </p>
        </div>

        {/* Presenter Actions */}
        <div className="relative flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={onOpenQR}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>ฉาย QR Code จอใหญ่</span>
          </button>

          <button
            onClick={onExportCSV}
            disabled={count === 0}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition disabled:opacity-50"
            title="ดาวน์โหลดผลคะแนนเป็น CSV เปิดใน Excel ได้"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          <button
            onClick={onSimulateResponse}
            className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95"
            title="จำลองคนตอบเพิ่ม 1 คน เพื่อทดสอบแอนิเมชันกราฟวงกลมเรียลไทม์"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>จำลองคำตอบทดสอบ</span>
          </button>

          <button
            onClick={() => {
              if (confirm('คุณต้องการล้างข้อมูลคำตอบทั้งหมด หรือโหลดข้อมูลตัวอย่าง? กด OK เพื่อล้างข้อมูล')) {
                onClearData();
              }
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/60 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 transition"
            title="ล้างข้อมูลทั้งหมด"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onSeedData}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition"
            title="โหลดข้อมูลตัวอย่างชุดใหม่"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Large Vibrant KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Respondents */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>จำนวนผู้ประเมิน</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
              {count}
            </span>
            <span className="text-base text-slate-600 dark:text-slate-400 font-semibold">คน</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>อัปเดตแบบเรียลไทม์อัตโนมัติ</span>
          </div>
        </div>

        {/* Metric 2: Overall Score Average */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>คะแนนเฉลี่ยรวมทุกข้อ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 tracking-tight tabular-nums">
              {count > 0 ? overallAvg.toFixed(2) : '0.00'}
            </span>
            <span className="text-base text-slate-600 dark:text-slate-400 font-semibold">/ 5.00</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-amber-500 text-xs font-semibold">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span className={overallAvg >= 4.5 ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}>★</span>
            <span className="text-slate-600 dark:text-slate-400 text-xs ml-1">
              ({count > 0 ? ((overallAvg / 5) * 100).toFixed(0) : 0}%)
            </span>
          </div>
        </div>

        {/* Metric 3: Standard 5-Tier Level Interpretation */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <div className="flex items-center gap-1.5">
              <span>ระดับการแปลผล</span>
              <button
                onClick={() => setShowInterpretationGuide(!showInterpretationGuide)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="คลิกดูเกณฑ์มาตรฐาน 5 ระดับ"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            {count > 0 ? (
              <span
                className={`inline-block px-3.5 py-1.5 rounded-2xl text-sm sm:text-base font-bold border shadow-sm ${overallInterp.badgeClass}`}
              >
                {overallInterp.label}
              </span>
            ) : (
              <span className="inline-block px-3 py-1.5 rounded-2xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">
                รอผลการประเมิน
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            เกณฑ์ 4.51-5.00: มากที่สุด | 3.51-4.50: มาก
          </p>
        </div>

        {/* Metric 4: Positive Satisfaction Rate (Score 4-5) */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>ความพึงพอใจระดับดีขึ้นไป</span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 tracking-tight tabular-nums">
              {positiveRate}%
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            {count > 0 ? (
              <span>
                ผู้ตอบ {positiveCount} ใน {count} คน ให้คะแนนระดับ 4 หรือ 5
              </span>
            ) : (
              <span>ยังไม่มีข้อมูล</span>
            )}
          </div>
        </div>
      </div>

      {/* Popover / Collapsible Guide for 5-level Likert Interpretation */}
      {showInterpretationGuide && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-blue-500/40 shadow-xl text-xs space-y-2 animate-in fade-in">
          <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
            <span>📖 เกณฑ์การแปลความหมายคะแนนเฉลี่ย 5 ระดับ (Likert Scale Standard)</span>
            <button
              onClick={() => setShowInterpretationGuide(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-base"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-sm">4.51 - 5.00</span>
              <span className="text-slate-900 dark:text-white font-semibold">มากที่สุด (ยอดเยี่ยม)</span>
            </div>
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/25">
              <span className="font-bold text-sky-600 dark:text-sky-400 block text-sm">3.51 - 4.50</span>
              <span className="text-slate-900 dark:text-white font-semibold">มาก (ดีมาก)</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <span className="font-bold text-amber-600 dark:text-amber-400 block text-sm">2.51 - 3.50</span>
              <span className="text-slate-900 dark:text-white font-semibold">ปานกลาง (พอใช้)</span>
            </div>
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/25">
              <span className="font-bold text-orange-600 dark:text-orange-400 block text-sm">1.51 - 2.50</span>
              <span className="text-slate-900 dark:text-white font-semibold">น้อย (ควรปรับปรุง)</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25">
              <span className="font-bold text-rose-600 dark:text-rose-400 block text-sm">1.00 - 1.50</span>
              <span className="text-slate-900 dark:text-white font-semibold">น้อยที่สุด (ปรับปรุงเร่งด่วน)</span>
            </div>
          </div>
        </div>
      )}

      {/* CIRCULAR SECTION 1: Vibrant Donut Distribution Chart */}
      <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                กราฟวงกลม: สัดส่วนคะแนนความพึงพอใจภาพรวม
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                สัดส่วนการให้คะแนน 5 ระดับ (5 ดาว ถึง 1 ดาว) จากคำตอบของผู้เข้าอบรมทั้งหมด
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            Donut Distribution Chart
          </span>
        </div>

        {/* Circular Donut Component */}
        <DonutDistributionChart
          slices={donutSlices}
          totalCount={count}
          overallAverage={overallAvg}
        />
      </div>

      {/* CIRCULAR SECTION 2: 5 Circular Radial Gauges (Replaces Old Bar Charts!) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 5 Circular Gauges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                  <CircleDot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    กราฟวงกลม: คะแนนเฉลี่ยแยกรายข้อ (1 - 5)
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Circular Radial Meters แสดงค่าเฉลี่ยและความพึงพอใจทั้ง 5 ด้าน
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                เป้าหมาย &ge; 4.00
              </span>
            </div>

            {/* List of Questions with Circular Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SURVEY_QUESTIONS.map((q, idx) => {
                const score = averages[idx] || 0;
                const itemInterp = getInterpretation(score);
                const qKey = q.id;
                const dist = scoreCounts[qKey] || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

                return (
                  <div
                    key={q.id}
                    className={`bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between transition-all hover:shadow-lg ${
                      idx === 4 ? 'sm:col-span-2 sm:flex-row sm:items-center' : ''
                    }`}
                  >
                    {/* Left/Top Info */}
                    <div className="flex-1 pr-2 mb-4 sm:mb-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg"
                          style={{
                            background: `${q.gradientColors[0]}15`,
                            color: q.gradientColors[0],
                          }}
                        >
                          {q.category}
                        </span>
                        {count > 0 && (
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-lg font-bold border ${itemInterp.badgeClass}`}
                          >
                            {itemInterp.label}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                        {q.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {q.description}
                      </p>

                      {/* Mini Score Distribution Badges */}
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                        {[5, 4, 3, 2, 1].map((s) => {
                          const sCount = dist[s] || 0;
                          return (
                            <span
                              key={s}
                              className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold tabular-nums"
                              title={`${s} ดาว: ${sCount} คน`}
                            >
                              ★{s}: <strong className="text-slate-900 dark:text-white">{sCount}</strong>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Circular Gauge */}
                    <div className="flex-shrink-0 flex items-center justify-center p-2">
                      <CircularGauge
                        score={score}
                        maxScore={5}
                        size={105}
                        strokeWidth={10}
                        gradientId={`q-grad-${q.id}`}
                        colors={q.gradientColors}
                        subLabel="คะแนนเฉลี่ย"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Feedback Stream */}
        <div className="space-y-4">
          <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[750px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">ข้อเสนอแนะล่าสุด</h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-bold tabular-nums">
                {feedbackList.length} ข้อความ
              </span>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 scrollbar-thin">
              {feedbackList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mb-3 shadow-inner">
                    💬
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">ยังไม่มีข้อเสนอแนะ</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                    เมื่อผู้เข้าอบรมพิมพ์ข้อเสนอแนะ ข้อความจะปรากฏบนจอนี้แบบเรียลไทม์ทันที
                  </p>
                </div>
              ) : (
                feedbackList.map((item, idx) => {
                  const userAvg = (
                    (item.q1 + item.q2 + item.q3 + item.q4 + item.q5) /
                    5
                  ).toFixed(1);
                  const isRecent = idx === 0;

                  return (
                    <div
                      key={item.id || idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isRecent
                          ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-slate-900 dark:to-slate-800/90 border-blue-400 dark:border-blue-500/40 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400/30'
                          : 'bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-slate-200">ผู้เข้าร่วมอบรม</span>
                          {isRecent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black">
                              ใหม่สด
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(item.timestamp)}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-normal">
                        "{item.feedback}"
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>คะแนนประเมินของผู้ตอบท่านนี้:</span>
                        <span className="font-bold text-amber-500">★ {userAvg} / 5.0</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick trigger footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={onOpenQR}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition"
              >
                <QrCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>แสดง QR Code บนจอ ให้ผู้ฟังเขียนข้อเสนอแนะ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
