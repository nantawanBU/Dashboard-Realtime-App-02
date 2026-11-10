import { SurveyQuestion } from '../types';

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'q1',
    title: '1. ความชัดเจนและประโยชน์ของเนื้อหาการอบรม',
    category: 'ด้านเนื้อหาหลักสูตร',
    description: 'เนื้อหามีความน่าสนใจ สอดคล้องกับหัวข้อ และเรียบเรียงเป็นลำดับขั้นตอนเข้าใจง่าย',
    gradientColors: ['#3b82f6', '#06b6d4'], // Blue to Cyan
    accentColor: 'blue',
  },
  {
    id: 'q2',
    title: '2. ความรู้ ความเชี่ยวชาญ และลีลาการบรรยายของวิทยากร',
    category: 'ด้านวิทยากร',
    description: 'วิทยากรถ่ายทอดได้ตรงประเด็น ยกตัวอย่างชัดเจน และตอบข้อซักถามอย่างครบถ้วน',
    gradientColors: ['#10b981', '#14b8a6'], // Emerald to Teal
    accentColor: 'emerald',
  },
  {
    id: 'q3',
    title: '3. การจัดกิจกรรมฝึกปฏิบัติและการมีส่วนร่วม',
    category: 'ด้านการมีส่วนร่วม',
    description: 'มีกิจกรรมหรือตัวอย่างให้ฝึกคิด/ลงมือทำ และเปิดโอกาสให้ซักถามแลกเปลี่ยน',
    gradientColors: ['#8b5cf6', '#d946ef'], // Violet to Fuchsia
    accentColor: 'violet',
  },
  {
    id: 'q4',
    title: '4. ความเหมาะสมของสื่อ สไลด์ เอกสาร และบรรยากาศการอบรม',
    category: 'ด้านสื่อและสิ่งอำนวยความสะดวก',
    description: 'สไลด์ประกอบการสอนอ่านง่าย อุปกรณ์และแพลตฟอร์มใช้งานได้อย่างราบรื่น',
    gradientColors: ['#f59e0b', '#f97316'], // Amber to Orange
    accentColor: 'amber',
  },
  {
    id: 'q5',
    title: '5. ความสามารถในการนำความรู้ไปประยุกต์ใช้ในการทำงานจริง',
    category: 'ด้านการนำไปใช้ประโยชน์',
    description: 'ได้เทคนิค แนวคิด หรือทักษะที่สามารถนำไปปรับใช้กับภาระงานได้ทันที',
    gradientColors: ['#ec4899', '#f43f5e'], // Pink to Rose
    accentColor: 'rose',
  },
];

export const RATING_LEVELS = [
  {
    score: 5,
    label: 'มากที่สุด',
    emoji: '🤩',
    gradientColors: ['#10b981', '#14b8a6'] as [string, string],
    colorHex: '#10b981',
    activeBg: 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 border-emerald-400',
    textCol: 'text-emerald-500 dark:text-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    score: 4,
    label: 'มาก',
    emoji: '😊',
    gradientColors: ['#0284c7', '#06b6d4'] as [string, string],
    colorHex: '#0284c7',
    activeBg: 'bg-gradient-to-tr from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30 border-sky-400',
    textCol: 'text-sky-500 dark:text-sky-400',
    badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30',
  },
  {
    score: 3,
    label: 'ปานกลาง',
    emoji: '😐',
    gradientColors: ['#f59e0b', '#eab308'] as [string, string],
    colorHex: '#f59e0b',
    activeBg: 'bg-gradient-to-tr from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30 border-amber-400',
    textCol: 'text-amber-500 dark:text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
  },
  {
    score: 2,
    label: 'น้อย',
    emoji: '🙁',
    gradientColors: ['#f97316', '#fb923c'] as [string, string],
    colorHex: '#f97316',
    activeBg: 'bg-gradient-to-tr from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30 border-orange-400',
    textCol: 'text-orange-500 dark:text-orange-400',
    badgeClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30',
  },
  {
    score: 1,
    label: 'น้อยที่สุด',
    emoji: '😞',
    gradientColors: ['#f43f5e', '#e11d48'] as [string, string],
    colorHex: '#f43f5e',
    activeBg: 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 border-rose-400',
    textCol: 'text-rose-500 dark:text-rose-400',
    badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
  },
];

/**
 * เกณฑ์การแปลผลคะแนนเฉลี่ย 5 ระดับ (ตามเกณฑ์มาตรฐาน Likert Scale):
 * 4.51 - 5.00 : ระดับมากที่สุด
 * 3.51 - 4.50 : ระดับมาก
 * 2.51 - 3.50 : ระดับปานกลาง
 * 1.51 - 2.50 : ระดับน้อย
 * 1.00 - 1.50 : ระดับน้อยที่สุด
 */
export function getInterpretation(score: number): {
  label: string;
  badgeClass: string;
  colorHex: string;
  level: number;
} {
  if (score >= 4.51) {
    return {
      label: 'มากที่สุด (ยอดเยี่ยม)',
      badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
      colorHex: '#10b981',
      level: 5,
    };
  } else if (score >= 3.51) {
    return {
      label: 'มาก (ดีมาก)',
      badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/40',
      colorHex: '#0284c7',
      level: 4,
    };
  } else if (score >= 2.51) {
    return {
      label: 'ปานกลาง (พอใช้)',
      badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40',
      colorHex: '#f59e0b',
      level: 3,
    };
  } else if (score >= 1.51) {
    return {
      label: 'น้อย (ควรปรับปรุง)',
      badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/40',
      colorHex: '#f97316',
      level: 2,
    };
  } else {
    return {
      label: 'น้อยที่สุด (ต้องปรับปรุงเร่งด่วน)',
      badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40',
      colorHex: '#f43f5e',
      level: 1,
    };
  }
}

export const QUICK_FEEDBACK_CHIPS = [
  'วิทยากรถ่ายทอดได้ดีมาก',
  'เนื้อหาเข้าใจง่ายและใช้งานได้จริง',
  'อยากให้เพิ่มเวลาฝึกปฏิบัติ',
  'สไลด์ประกอบสวยงาม ละเอียด',
  'อยากให้มีหลักสูตรขั้นสูงต่อยอด',
  'บรรยากาศเป็นกันเองมาก',
];
