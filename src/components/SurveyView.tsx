import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Send,
  Lock,
  ChevronRight,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { SURVEY_QUESTIONS, RATING_LEVELS, QUICK_FEEDBACK_CHIPS } from '../constants/surveyData';
import { SurveyResponse } from '../types';

interface SurveyViewProps {
  onSubmitSuccess: (newResponse: SurveyResponse) => void;
  onGoToDashboard: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSubmitSuccess, onGoToDashboard }) => {
  const [scores, setScores] = useState<{ [key: string]: number | null }>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  });

  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<SurveyResponse | null>(null);

  // Check duplicate submission on mount
  useEffect(() => {
    const saved = localStorage.getItem('training_survey_submitted_record');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubmittedData(parsed);
        setAlreadySubmitted(true);
      } catch (e) {
        localStorage.removeItem('training_survey_submitted_record');
      }
    }
  }, []);

  const answeredCount = Object.values(scores).filter((v) => v !== null).length;
  const progressPercent = Math.round((answeredCount / 5) * 100);

  const handleScoreSelect = (questionId: string, score: number) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: score,
    }));
    setErrorMessage(null);
  };

  const handleAddQuickTag = (tag: string) => {
    if (feedback.includes(tag)) return;
    setFeedback((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all 5 questions
    const unanswered = SURVEY_QUESTIONS.filter((q) => scores[q.id] === null);
    if (unanswered.length > 0) {
      setErrorMessage(`กรุณาตอบแบบประเมินให้ครบทั้ง 5 ข้อ (เหลืออีก ${unanswered.length} ข้อ)`);
      const firstId = unanswered[0].id;
      const el = document.getElementById(`card-${firstId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      q1: scores.q1!,
      q2: scores.q2!,
      q3: scores.q3!,
      q4: scores.q4!,
      q5: scores.q5!,
      feedback: feedback.trim(),
      deviceFingerprint: `device_${Math.random().toString(36).substring(2, 9)}`,
    };

    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'ไม่สามารถบันทึกข้อมูลได้');
      }

      const created: SurveyResponse = json.data;

      localStorage.setItem('training_survey_submitted_record', JSON.stringify(created));
      setSubmittedData(created);
      setAlreadySubmitted(true);

      // Trigger colorful celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });

      onSubmitSuccess(created);
    } catch (err: any) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการส่งแบบสอบถาม');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    localStorage.removeItem('training_survey_submitted_record');
    setAlreadySubmitted(false);
    setSubmittedData(null);
    setScores({ q1: null, q2: null, q3: null, q4: null, q5: null });
    setFeedback('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If already submitted in this browser
  if (alreadySubmitted && submittedData) {
    const avg = (
      (submittedData.q1 + submittedData.q2 + submittedData.q3 + submittedData.q4 + submittedData.q5) /
      5
    ).toFixed(2);

    return (
      <div className="max-w-xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-5 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
            บันทึกคำตอบเรียบร้อยแล้ว
          </span>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            ขอขอบพระคุณสำหรับความคิดเห็น!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            ข้อมูลการประเมินของคุณถูกส่งเข้าระบบ Dashboard เรียบร้อยแล้ว และจะนำไปใช้ในการพัฒนาปรับปรุงหลักสูตรให้ดียิ่งขึ้น
          </p>

          {/* Submitted Score Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">คะแนนเฉลี่ยที่คุณให้:</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {avg} / 5.00
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>1. เนื้อหาหลักสูตร</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.q1} / 5</span>
              </div>
              <div className="flex justify-between">
                <span>2. วิทยากร</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.q2} / 5</span>
              </div>
              <div className="flex justify-between">
                <span>3. การมีส่วนร่วม</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.q3} / 5</span>
              </div>
              <div className="flex justify-between">
                <span>4. สื่อและอุปกรณ์</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.q4} / 5</span>
              </div>
              <div className="flex justify-between">
                <span>5. การนำไปใช้จริง</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedData.q5} / 5</span>
              </div>
            </div>

            {submittedData.feedback && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">ข้อเสนอแนะของคุณ:</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  "{submittedData.feedback}"
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onGoToDashboard}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <span>ดูผลบน Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetForTesting}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 transition"
              title="ลบสถานะส่งแล้ว เพื่อตอบใหม่อีกครั้ง"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>ทำแบบสอบถามใหม่อีกครั้ง</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
      {/* Vibrant Hero Header Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>แบบประเมินผู้เข้าร่วมอบรม</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-300 text-xs">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>ไม่ระบุตัวตน (Anonymous)</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            แบบสอบถามความพึงพอใจการอบรม
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed mb-5">
            กรุณาเลือกให้คะแนนความพึงพอใจตามความเป็นจริงในแต่ละหัวข้อ (1 = น้อยที่สุด จนถึง 5 = มากที่สุด)
            เพื่อเป็นประโยชน์ในการพัฒนาและปรับปรุงหลักสูตรในครั้งถัดไป
          </p>

          {/* Progress Bar */}
          <div className="space-y-1.5 bg-black/20 backdrop-blur p-3 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-200 font-medium">ความคืบหน้าการตอบ</span>
              <span className="text-cyan-300 font-bold tabular-nums">
                ตอบแล้ว {answeredCount} จาก 5 ข้อ ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 via-amber-300 to-pink-400 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center gap-3 text-sm animate-pulse">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Survey Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {SURVEY_QUESTIONS.map((q, index) => {
          const selected = scores[q.id];

          return (
            <div
              key={q.id}
              id={`card-${q.id}`}
              className={`bg-white dark:bg-slate-900/90 border rounded-3xl p-5 sm:p-6 shadow-xl transition-all ${
                selected !== null
                  ? 'border-indigo-400 dark:border-indigo-500 shadow-indigo-500/10 ring-1 ring-indigo-400/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start gap-3 mb-4">
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${q.gradientColors[0]}, ${q.gradientColors[1]})`,
                  }}
                >
                  {index + 1}
                </span>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{
                        background: `${q.gradientColors[0]}15`,
                        color: q.gradientColors[0],
                      }}
                    >
                      {q.category}
                    </span>
                    {selected !== null && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                        เลือกแล้ว ({selected} คะแนน)
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                    {q.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{q.description}</p>
                </div>
              </div>

              {/* 5 Big Vibrant Likert Buttons */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-2">
                {RATING_LEVELS.slice()
                  .reverse() // Display 1 to 5 from left to right
                  .map((item) => {
                    const isPicked = selected === item.score;
                    return (
                      <button
                        key={item.score}
                        type="button"
                        onClick={() => handleScoreSelect(q.id, item.score)}
                        className={`group relative flex flex-col items-center justify-center py-3.5 px-1 sm:px-2 rounded-2xl border transition-all active:scale-95 ${
                          isPicked
                            ? `${item.activeBg} ring-2 ring-white/50 scale-102`
                            : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow group-hover:scale-110 transition-transform">
                          {item.emoji}
                        </span>
                        <span
                          className={`text-base sm:text-lg font-black leading-none ${
                            isPicked ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {item.score}
                        </span>
                        <span
                          className={`text-[10px] sm:text-xs mt-1 leading-tight text-center ${
                            isPicked ? 'text-white font-bold' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })}

        {/* Optional Comments / Feedback Card */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              ข้อเสนอแนะเพิ่มเติม / สิ่งที่ต้องการเรียนรู้ต่อไป
            </h3>
            <span className="text-slate-500 text-xs font-normal ml-auto">(ไม่บังคับ)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            เขียนข้อเสนอแนะถึงวิทยากร หรือหัวข้อที่อยากให้อบรมในรุ่นถัดไป
          </p>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="เช่น วิทยากรถ่ายทอดได้เข้าใจง่ายมาก, อยากให้เพิ่มเวลา Workshop ปฏิบัติ, บรรยากาศเป็นกันเอง..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
          />

          {/* Quick feedback tags */}
          <div className="mt-3">
            <span className="text-xs text-slate-500 block mb-1.5 font-medium">คลิกเพื่อใส่ข้อความเร็ว:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_FEEDBACK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddQuickTag(chip)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 transition active:scale-95 font-medium"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base text-white shadow-2xl flex items-center justify-center gap-3 transition-all ${
              answeredCount === 5
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:opacity-95 shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>กำลังบันทึกผลการประเมิน...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>
                  {answeredCount === 5
                    ? 'ส่งแบบประเมินความพึงพอใจ'
                    : `ส่งแบบประเมิน (ยังเหลืออีก ${5 - answeredCount} ข้อ)`}
                </span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>ระบบเก็บข้อมูลเพื่อนำไปประมวลผลทางสถิติเท่านั้น ไม่มีการจัดเก็บข้อมูลส่วนตัว</span>
          </p>
        </div>
      </form>
    </div>
  );
};
