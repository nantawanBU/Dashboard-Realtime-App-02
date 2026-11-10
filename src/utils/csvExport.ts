import { SurveyResponse } from '../types';
import { getInterpretation } from '../constants/surveyData';

export function exportResponsesToCSV(responses: SurveyResponse[], trainingTitle = 'รายงานผลการประเมินความพึงพอใจการอบรม'): void {
  if (!responses || responses.length === 0) {
    alert('ยังไม่มีข้อมูลการตอบแบบสอบถามสำหรับส่งออก');
    return;
  }

  // Header row
  const headers = [
    'ลำดับ',
    'รหัสคำตอบ',
    'วันเวลาที่ประเมิน',
    'ข้อ 1 (เนื้อหาหลักสูตร)',
    'ข้อ 2 (วิทยากร)',
    'ข้อ 3 (การมีส่วนร่วม)',
    'ข้อ 4 (สื่อและอุปกรณ์)',
    'ข้อ 5 (การนำไปใช้จริง)',
    'คะแนนเฉลี่ย',
    'ระดับความพึงพอใจ',
    'ข้อเสนอแนะเพิ่มเติม',
  ];

  const escapeCSV = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = responses.map((r, index) => {
    const avg = ((r.q1 + r.q2 + r.q3 + r.q4 + r.q5) / 5).toFixed(2);
    const interp = getInterpretation(parseFloat(avg)).label;
    const dateFormatted = new Date(r.timestamp).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return [
      escapeCSV(index + 1),
      escapeCSV(r.id),
      escapeCSV(dateFormatted),
      escapeCSV(r.q1),
      escapeCSV(r.q2),
      escapeCSV(r.q3),
      escapeCSV(r.q4),
      escapeCSV(r.q5),
      escapeCSV(avg),
      escapeCSV(interp),
      escapeCSV(r.feedback || '-'),
    ].join(',');
  });

  // Calculate overall averages
  const count = responses.length;
  const avgQ1 = (responses.reduce((sum, r) => sum + r.q1, 0) / count).toFixed(2);
  const avgQ2 = (responses.reduce((sum, r) => sum + r.q2, 0) / count).toFixed(2);
  const avgQ3 = (responses.reduce((sum, r) => sum + r.q3, 0) / count).toFixed(2);
  const avgQ4 = (responses.reduce((sum, r) => sum + r.q4, 0) / count).toFixed(2);
  const avgQ5 = (responses.reduce((sum, r) => sum + r.q5, 0) / count).toFixed(2);
  const overallAvg = (
    (parseFloat(avgQ1) + parseFloat(avgQ2) + parseFloat(avgQ3) + parseFloat(avgQ4) + parseFloat(avgQ5)) /
    5
  ).toFixed(2);
  const overallInterp = getInterpretation(parseFloat(overallAvg)).label;

  const summaryRow = [
    escapeCSV('สรุปค่าเฉลี่ย'),
    escapeCSV(`รวม ${count} คน`),
    escapeCSV(''),
    escapeCSV(avgQ1),
    escapeCSV(avgQ2),
    escapeCSV(avgQ3),
    escapeCSV(avgQ4),
    escapeCSV(avgQ5),
    escapeCSV(overallAvg),
    escapeCSV(overallInterp),
    escapeCSV(''),
  ].join(',');

  // Add BOM (\uFEFF) for Microsoft Excel Thai encoding support
  const csvContent =
    '\uFEFF' +
    `"${trainingTitle}"\n` +
    `"สร้างรายงานเมื่อ: ${new Date().toLocaleString('th-TH')}"\n\n` +
    headers.map((h) => `"${h}"`).join(',') +
    '\n' +
    rows.join('\n') +
    '\n' +
    summaryRow;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  link.setAttribute('href', url);
  link.setAttribute('download', `training_satisfaction_results_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
