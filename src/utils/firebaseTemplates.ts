export function generateSurveyHtml(firebaseConfig: {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}): string {
  const configStr = JSON.stringify(
    {
      apiKey: firebaseConfig.apiKey || 'YOUR_API_KEY',
      authDomain: firebaseConfig.authDomain || 'YOUR_PROJECT_ID.firebaseapp.com',
      databaseURL: firebaseConfig.databaseURL || 'https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app',
      projectId: firebaseConfig.projectId || 'YOUR_PROJECT_ID',
      storageBucket: firebaseConfig.storageBucket || 'YOUR_PROJECT_ID.appspot.com',
      messagingSenderId: firebaseConfig.messagingSenderId || '1234567890',
      appId: firebaseConfig.appId || '1:1234567890:web:abcdef123456',
    },
    null,
    2
  );

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <!-- Firebase App & Realtime Database SDK (v9 compat) -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <style>
    body { font-family: 'Prompt', sans-serif; }
    .scale-btn.active {
      transform: scale(1.05);
      border-color: #3b82f6;
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      color: #ffffff;
      box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen py-8 px-4 flex justify-center items-start">

  <div class="w-full max-w-lg">
    <!-- Header Card -->
    <header class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 mb-6 shadow-2xl backdrop-blur text-center relative overflow-hidden">
      <div class="absolute -right-12 -top-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
        <span>✨ แบบประเมินผลการอบรม</span>
      </div>
      <h1 class="text-2xl font-bold text-white tracking-tight mb-2">แบบสอบถามความพึงพอใจ</h1>
      <p class="text-slate-400 text-sm leading-relaxed">
        ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาหลักสูตรครั้งต่อไป (ไม่ระบุชื่อผู้ตอบ)
      </p>
    </header>

    <!-- Already Submitted Alert (Duplication check) -->
    <div id="alreadySubmittedView" class="hidden bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl mb-6">
      <div class="w-20 h-20 mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-4xl mb-4">
        🎉
      </div>
      <h2 class="text-xl font-bold text-white mb-2">ท่านได้ส่งแบบประเมินแล้ว</h2>
      <p class="text-slate-400 text-sm mb-6">ขอขอบพระคุณสำหรับข้อมูลและความคิดเห็นอันเป็นประโยชน์</p>
      <button onclick="resetSubmission()" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition">
        🔄 ทำแบบสอบถามใหม่อีกครั้ง (สำหรับทดสอบ)
      </button>
    </div>

    <!-- Survey Form -->
    <form id="surveyForm" onsubmit="handleSubmit(event)" class="space-y-6">

      <!-- Question 1 -->
      <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
        <div class="flex items-start gap-3 mb-4">
          <span class="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 text-sm font-bold flex items-center justify-center">1</span>
          <div>
            <h3 class="font-semibold text-slate-100 text-base">ความชัดเจนและประโยชน์ของเนื้อหา</h3>
            <p class="text-xs text-slate-400 mt-0.5">เนื้อหาเข้าใจง่าย ตรงตามวัตถุประสงค์การเรียนรู้</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q1-options"></div>
      </div>

      <!-- Question 2 -->
      <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
        <div class="flex items-start gap-3 mb-4">
          <span class="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 text-sm font-bold flex items-center justify-center">2</span>
          <div>
            <h3 class="font-semibold text-slate-100 text-base">ความรู้และลีลาการบรรยายของวิทยากร</h3>
            <p class="text-xs text-slate-400 mt-0.5">อธิบายตรงประเด็น ยกตัวอย่างชัดเจน ตอบคำถามได้ดี</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q2-options"></div>
      </div>

      <!-- Question 3 -->
      <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
        <div class="flex items-start gap-3 mb-4">
          <span class="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 text-sm font-bold flex items-center justify-center">3</span>
          <div>
            <h3 class="font-semibold text-slate-100 text-base">การจัดกิจกรรมและการมีส่วนร่วม</h3>
            <p class="text-xs text-slate-400 mt-0.5">เปิดโอกาสให้ซักถาม แลกเปลี่ยน และฝึกปฏิบัติจริง</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q3-options"></div>
      </div>

      <!-- Question 4 -->
      <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
        <div class="flex items-start gap-3 mb-4">
          <span class="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 text-sm font-bold flex items-center justify-center">4</span>
          <div>
            <h3 class="font-semibold text-slate-100 text-base">สื่อ สไลด์ เอกสาร และระบบการอบรม</h3>
            <p class="text-xs text-slate-400 mt-0.5">เอกสารอ่านง่าย อุปกรณ์และสัญญาณพร้อมใช้งาน</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q4-options"></div>
      </div>

      <!-- Question 5 -->
      <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
        <div class="flex items-start gap-3 mb-4">
          <span class="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 text-sm font-bold flex items-center justify-center">5</span>
          <div>
            <h3 class="font-semibold text-slate-100 text-base">การนำความรู้ไปประยุกต์ใช้ในการทำงาน</h3>
            <p class="text-xs text-slate-400 mt-0.5">สามารถนำสิ่งที่ได้ไปปรับใช้ต่อได้ทันที</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q5-options"></div>
      </div>

      <!-- Optional Feedback -->
      <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
        <label for="feedback" class="block font-semibold text-slate-100 text-sm mb-1">
          ข้อเสนอแนะเพิ่มเติม / หัวข้อที่ต้องการเรียนรู้ต่อไป <span class="text-slate-500 text-xs font-normal">(ไม่บังคับ)</span>
        </label>
        <textarea id="feedback" rows="3" class="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition" placeholder="พิมพ์ข้อเสนอแนะ เช่น ประทับใจวิทยากร, อยากให้เพิ่มเวลา Workshop..."></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit" id="submitBtn" class="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-semibold text-base shadow-xl hover:shadow-blue-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2">
        <span>ส่งแบบประเมินความพึงพอใจ</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </button>

      <p class="text-center text-xs text-slate-500">🔒 ปลอดภัย ไม่ระบุตัวตน ไม่เก็บข้อมูลส่วนตัว</p>
    </form>
  </div>

  <script>
    // 1. ตั้งค่า Firebase Configuration
    const firebaseConfig = ${configStr};

    // เริ่มต้นเชื่อมต่อ Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    // ตัวเลือกคะแนน 1-5 พร้อม Emoji และป้ายกำกับ
    const ratingScale = [
      { score: 1, label: 'น้อยสุด', emoji: '😞' },
      { score: 2, label: 'น้อย', emoji: '🙁' },
      { score: 3, label: 'ปานกลาง', emoji: '😐' },
      { score: 4, label: 'มาก', emoji: '😊' },
      { score: 5, label: 'มากที่สุด', emoji: '🤩' },
    ];

    const answers = { q1: null, q2: null, q3: null, q4: null, q5: null };

    // Render 1-5 Scale Buttons
    ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(qId => {
      const container = document.getElementById(qId + '-options');
      ratingScale.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'scale-btn flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition active:scale-95';
        btn.innerHTML = '<span class="text-xl mb-1">' + item.emoji + '</span>' +
                        '<span class="text-xs font-semibold text-slate-200">' + item.score + '</span>' +
                        '<span class="text-[10px] text-slate-400 mt-0.5">' + item.label + '</span>';
        btn.onclick = () => selectScore(qId, item.score, btn);
        container.appendChild(btn);
      });
    });

    function selectScore(qId, score, clickedBtn) {
      answers[qId] = score;
      const parent = clickedBtn.parentElement;
      Array.from(parent.children).forEach(b => b.classList.remove('active'));
      clickedBtn.classList.add('active');
    }

    // ตรวจสอบการตอบซ้ำด้วย localStorage
    function checkPreviousSubmission() {
      if (localStorage.getItem('training_survey_done')) {
        document.getElementById('surveyForm').classList.add('hidden');
        document.getElementById('alreadySubmittedView').classList.remove('hidden');
      }
    }
    checkPreviousSubmission();

    function resetSubmission() {
      localStorage.removeItem('training_survey_done');
      location.reload();
    }

    // บันทึกลง Firebase Realtime Database
    async function handleSubmit(e) {
      e.preventDefault();

      // ตรวจสอบว่าตอบครบ 5 ข้อหรือไม่
      const missing = Object.entries(answers).find(([k, v]) => v === null);
      if (missing) {
        alert('กรุณาเลือกให้คะแนนความพึงพอใจให้ครบทั้ง 5 ข้อครับ');
        return;
      }

      const feedback = document.getElementById('feedback').value.trim();
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ กำลังบันทึกข้อมูล...';

      const payload = {
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
        feedback: feedback,
        timestamp: new Date().toISOString()
      };

      try {
        await db.ref('responses').push(payload);
        
        // บันทึกสถานะว่าตอบแล้ว
        localStorage.setItem('training_survey_done', 'true');

        // เอฟเฟกต์จุดพลุเฉลิมฉลอง
        if (typeof confetti === 'function') {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        setTimeout(() => {
          document.getElementById('surveyForm').classList.add('hidden');
          document.getElementById('alreadySubmittedView').classList.remove('hidden');
        }, 600);

      } catch (error) {
        console.error(error);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + error.message + '\\n(โปรดตรวจสอบ Firebase Database Rules ว่าเปิด read: true, write: true หรือยัง)');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'ส่งแบบประเมินความพึงพอใจ';
      }
    }
  </script>
</body>
</html>`;
}

export function generateDashboardHtml(firebaseConfig: {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}): string {
  const configStr = JSON.stringify(
    {
      apiKey: firebaseConfig.apiKey || 'YOUR_API_KEY',
      authDomain: firebaseConfig.authDomain || 'YOUR_PROJECT_ID.firebaseapp.com',
      databaseURL: firebaseConfig.databaseURL || 'https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app',
      projectId: firebaseConfig.projectId || 'YOUR_PROJECT_ID',
      storageBucket: firebaseConfig.storageBucket || 'YOUR_PROJECT_ID.appspot.com',
      messagingSenderId: firebaseConfig.messagingSenderId || '1234567890',
      appId: firebaseConfig.appId || '1:1234567890:web:abcdef123456',
    },
    null,
    2
  );

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard ความพึงพอใจการอบรม (Real-time)</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- QRCode CDN -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Firebase SDK -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <style>
    body { font-family: 'Prompt', sans-serif; }
    .pulse-dot {
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 lg:p-8">

  <!-- Top Bar -->
  <header class="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
        📊
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl lg:text-2xl font-bold text-white tracking-tight">Real-time Training Dashboard</h1>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
            LIVE
          </span>
        </div>
        <p class="text-xs lg:text-sm text-slate-400">ระบบติดตามและประมวลผลความพึงพอใจการอบรมสด</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 w-full md:w-auto">
      <button onclick="openQRModal()" class="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition">
        <span>📱 QR Code สแกนตอบ</span>
      </button>
      <button onclick="exportCSV()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 flex items-center gap-2 transition">
        <span>📥 ดาวน์โหลด CSV</span>
      </button>
      <button onclick="toggleFullscreen()" class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition" title="เต็มจอสำหรับโปรเจกเตอร์">
        ⛶
      </button>
    </div>
  </header>

  <!-- Metric Overview Cards -->
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
    <!-- Total Respondents -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
      <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">จำนวนผู้ประเมินทั้งหมด</span>
      <div class="mt-2 flex items-baseline gap-2">
        <span id="metricCount" class="text-4xl lg:text-5xl font-black text-white">0</span>
        <span class="text-sm text-slate-400">คน</span>
      </div>
      <p class="text-xs text-slate-500 mt-2">อัปเดตแบบเรียลไทม์ทันทีที่มีผู้ส่ง</p>
    </div>

    <!-- Overall Average -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
      <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">คะแนนเฉลี่ยรวมทุกข้อ</span>
      <div class="mt-2 flex items-baseline gap-2">
        <span id="metricAverage" class="text-4xl lg:text-5xl font-black text-blue-400">0.00</span>
        <span class="text-sm text-slate-400">/ 5.00</span>
      </div>
      <p class="text-xs text-slate-500 mt-2">คำนวณจาก Likert Scale 5 ระดับ</p>
    </div>

    <!-- Level Interpretation -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
      <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">ระดับความพึงพอใจภาพรวม</span>
      <div class="mt-3">
        <span id="metricLevelBadge" class="inline-block px-3 py-1.5 rounded-xl text-base font-bold bg-slate-800 text-slate-400 border border-slate-700">
          รอผลประเมิน
        </span>
      </div>
      <p class="text-xs text-slate-500 mt-2">เกณฑ์มาตรฐาน (4.51-5.00: มากที่สุด)</p>
    </div>

    <!-- % Positive (Score >= 4) -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
      <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">ความพึงพอใจระดับดีขึ้นไป (4-5)</span>
      <div class="mt-2 flex items-baseline gap-2">
        <span id="metricPositive" class="text-4xl lg:text-5xl font-black text-emerald-400">0%</span>
      </div>
      <p class="text-xs text-slate-500 mt-2">สัดส่วนผู้ให้คะแนนระดับ 4 และ 5</p>
    </div>
  </section>

  <!-- Main Grid: Charts & Comments -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
    <!-- Left 2 Cols: Question Bars & Chart -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Chart Card -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <span>🍩 กราฟวงกลม: สัดส่วนคะแนนความพึงพอใจ 5 ระดับ</span>
          </h2>
          <span class="text-xs text-slate-400">Doughnut Chart</span>
        </div>
        <div class="h-64">
          <canvas id="questionChart"></canvas>
        </div>
      </div>

      <!-- Question Detail Breakdown -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4" id="questionsBreakdown">
        <!-- Rendered by JS -->
      </div>
    </div>

    <!-- Right 1 Col: Live Feedback Feed -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[650px]">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <h2 class="text-base font-bold text-white flex items-center gap-2">
          <span>💬 ข้อเสนอแนะล่าสุด</span>
        </h2>
        <span id="feedbackCount" class="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold">0 ข้อความ</span>
      </div>

      <!-- Feed Container -->
      <div id="feedbackList" class="flex-1 overflow-y-auto space-y-3 pr-1">
        <p class="text-slate-500 text-sm text-center py-10">ยังไม่มีข้อเสนอแนะใหม่</p>
      </div>
    </div>
  </div>

  <!-- QR Code Modal -->
  <div id="qrModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md hidden z-50 flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 max-w-md w-full text-center relative shadow-2xl">
      <button onclick="closeQRModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✕</button>
      <h3 class="text-xl font-bold text-white mb-1">สแกนเพื่อตอบแบบสอบถาม</h3>
      <p class="text-xs text-slate-400 mb-6">เปิดกล้องมือถือแล้วสแกน QR Code เพื่อเริ่มทำแบบประเมินได้ทันที</p>
      
      <div class="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto mb-4">
        <canvas id="qrCanvas"></canvas>
      </div>

      <div class="flex items-center justify-center gap-2">
        <input id="surveyUrlInput" type="text" readonly class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300" value="survey.html">
        <button onclick="copySurveyLink()" class="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs whitespace-nowrap">คัดลอก</button>
      </div>
    </div>
  </div>

  <script>
    // 1. ตั้งค่า Firebase Configuration
    const firebaseConfig = ${configStr};

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    const questionTitles = [
      '1. เนื้อหาหลักสูตร',
      '2. วิทยากร',
      '3. กิจกรรมการมีส่วนร่วม',
      '4. สื่อและอุปกรณ์',
      '5. การนำไปใช้จริง'
    ];

    let allResponses = [];
    let myChart = null;

    // Initialize Chart.js with Vibrant Doughnut Chart
    function initChart() {
      const ctx = document.getElementById('questionChart').getContext('2d');
      myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            '5 ดาว (มากที่สุด)',
            '4 ดาว (มาก)',
            '3 ดาว (ปานกลาง)',
            '2 ดาว (น้อย)',
            '1 ดาว (น้อยที่สุด)'
          ],
          datasets: [{
            label: 'จำนวนผู้ให้คะแนน',
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              '#10b981', // 5 ดาว: Emerald
              '#06b6d4', // 4 ดาว: Cyan
              '#f59e0b', // 3 ดาว: Amber
              '#f97316', // 2 ดาว: Orange
              '#f43f5e'  // 1 ดาว: Rose
            ],
            borderColor: '#0f172a',
            borderWidth: 3,
            hoverOffset: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#cbd5e1',
                font: { family: 'Prompt', size: 12 },
                padding: 16
              }
            }
          }
        }
      });
    }
    initChart();

    // เกณฑ์แปลผล 5 ระดับ
    function getInterpretation(score) {
      if (score >= 4.51) return { label: 'มากที่สุด (ยอดเยี่ยม)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      if (score >= 3.51) return { label: 'มาก (ดีมาก)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      if (score >= 2.51) return { label: 'ปานกลาง (พอใช้)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      if (score >= 1.51) return { label: 'น้อย (ควรปรับปรุง)', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
      return { label: 'น้อยที่สุด (ปรับปรุงเร่งด่วน)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    }

    // Real-time listener จาก Firebase
    db.ref('responses').on('value', (snapshot) => {
      const data = snapshot.val();
      allResponses = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
      updateDashboard();
    });

    function updateDashboard() {
      const count = allResponses.length;
      document.getElementById('metricCount').innerText = count;

      if (count === 0) {
        document.getElementById('metricAverage').innerText = '0.00';
        document.getElementById('metricLevelBadge').innerText = 'รอผลประเมิน';
        document.getElementById('metricPositive').innerText = '0%';
        if (myChart) {
          myChart.data.datasets[0].data = [0, 0, 0, 0, 0];
          myChart.update();
        }
        return;
      }

      // Calculate averages
      const sums = [0, 0, 0, 0, 0];
      let positiveCount = 0;
      let totalScorePoints = 0;

      allResponses.forEach(r => {
        const qScores = [Number(r.q1), Number(r.q2), Number(r.q3), Number(r.q4), Number(r.q5)];
        qScores.forEach((s, idx) => sums[idx] += s);
        const userAvg = qScores.reduce((a, b) => a + b, 0) / 5;
        if (userAvg >= 4) positiveCount++;
        totalScorePoints += userAvg;
      });

      const averages = sums.map(s => Number((s / count).toFixed(2)));
      const overallAvg = Number((totalScorePoints / count).toFixed(2));
      const interp = getInterpretation(overallAvg);

      document.getElementById('metricAverage').innerText = overallAvg.toFixed(2);
      
      const badge = document.getElementById('metricLevelBadge');
      badge.innerText = interp.label;
      badge.className = 'inline-block px-3 py-1.5 rounded-xl text-sm font-bold border ' + interp.color;

      // Count 5, 4, 3, 2, 1 star distributions for Doughnut Chart
      const starCounts = [0, 0, 0, 0, 0]; // [5, 4, 3, 2, 1]
      allResponses.forEach(r => {
        [r.q1, r.q2, r.q3, r.q4, r.q5].forEach(val => {
          const s = Number(val);
          if (s >= 1 && s <= 5) {
            starCounts[5 - s]++;
          }
        });
      });

      // Update Circular Doughnut Chart
      if (myChart) {
        myChart.data.datasets[0].data = starCounts;
        myChart.update();
      }

      // Update Detailed Question Bars
      renderQuestionBreakdown(averages);

      // Update Comments Feed
      renderFeedbacks();
    }

    function renderQuestionBreakdown(averages) {
      const container = document.getElementById('questionsBreakdown');
      container.innerHTML = '';
      questionTitles.forEach((title, idx) => {
        const score = averages[idx] || 0;
        const percent = Math.min(100, Math.round((score / 5) * 100));
        const itemInterp = getInterpretation(score);

        const row = document.createElement('div');
        row.className = 'space-y-1.5';
        row.innerHTML = 
          '<div class="flex justify-between items-center text-sm">' +
            '<span class="font-medium text-slate-200">' + title + '</span>' +
            '<div class="flex items-center gap-2">' +
              '<span class="text-xs px-2 py-0.5 rounded-md border ' + itemInterp.color + '">' + itemInterp.label + '</span>' +
              '<span class="font-bold text-white">' + score.toFixed(2) + ' <span class="text-xs text-slate-400">/ 5.0</span></span>' +
            '</div>' +
          '</div>' +
          '<div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">' +
            '<div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500" style="width: ' + percent + '%"></div>' +
          '</div>';
        container.appendChild(row);
      });
    }

    function renderFeedbacks() {
      const list = document.getElementById('feedbackList');
      const feedbacks = allResponses.filter(r => r.feedback && r.feedback.trim() !== '');
      document.getElementById('feedbackCount').innerText = feedbacks.length + ' ข้อความ';

      if (feedbacks.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-sm text-center py-10">ยังไม่มีข้อเสนอแนะเพิ่มเติม</p>';
        return;
      }

      list.innerHTML = '';
      feedbacks.reverse().forEach(r => {
        const div = document.createElement('div');
        div.className = 'bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-sm';
        const dateStr = r.timestamp ? new Date(r.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '';
        div.innerHTML = 
          '<div class="flex justify-between items-center text-xs text-slate-400 mb-1">' +
            '<span>ผู้เข้าร่วมอบรม</span>' +
            '<span>' + dateStr + '</span>' +
          '</div>' +
          '<p class="text-slate-200">' + escapeHtml(r.feedback) + '</p>';
        list.appendChild(div);
      });
    }

    function escapeHtml(str) {
      return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // QR Code Modal
    function openQRModal() {
      const modal = document.getElementById('qrModal');
      modal.classList.remove('hidden');
      const surveyUrl = window.location.href.replace('dashboard.html', 'survey.html');
      document.getElementById('surveyUrlInput').value = surveyUrl;
      QRCode.toCanvas(document.getElementById('qrCanvas'), surveyUrl, { width: 220, margin: 1 });
    }

    function closeQRModal() {
      document.getElementById('qrModal').classList.add('hidden');
    }

    function copySurveyLink() {
      const copyText = document.getElementById('surveyUrlInput');
      copyText.select();
      navigator.clipboard.writeText(copyText.value);
      alert('คัดลอกลิงก์เรียบร้อยแล้ว!');
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    // Export CSV with UTF-8 BOM
    function exportCSV() {
      if (allResponses.length === 0) {
        alert('ยังไม่มีข้อมูลสำหรับส่งออก');
        return;
      }
      const headers = ['ลำดับ', 'วันเวลา', 'ข้อ 1 (เนื้อหา)', 'ข้อ 2 (วิทยากร)', 'ข้อ 3 (กิจกรรม)', 'ข้อ 4 (สื่อ)', 'ข้อ 5 (นำไปใช้)', 'คะแนนเฉลี่ย', 'ข้อเสนอแนะ'];
      const rows = allResponses.map((r, i) => {
        const avg = ((Number(r.q1) + Number(r.q2) + Number(r.q3) + Number(r.q4) + Number(r.q5)) / 5).toFixed(2);
        return [
          i + 1,
          r.timestamp || '',
          r.q1,
          r.q2,
          r.q3,
          r.q4,
          r.q5,
          avg,
          '"' + (r.feedback || '').replace(/"/g, '""') + '"'
        ].join(',');
      });

      const csvContent = '\\uFEFF' + headers.join(',') + '\\n' + rows.join('\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'training_survey_results_' + new Date().toISOString().slice(0, 10) + '.csv';
      link.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}
