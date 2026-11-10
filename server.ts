import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface SurveyResponse {
  id: string;
  q1: number; // ความชัดเจนของเนื้อหาและหลักสูตร
  q2: number; // ความรู้ความเชี่ยวชาญของวิทยากร
  q3: number; // การจัดกิจกรรมและการมีส่วนร่วม
  q4: number; // สื่อ เอกสาร และอุปกรณ์การเรียนรู้
  q5: number; // การนำความรู้ไปประยุกต์ใช้ได้จริง
  feedback?: string;
  timestamp: string;
  deviceFingerprint?: string;
}

// Initial realistic seed responses for workshop presentation
const initialResponses: SurveyResponse[] = [
  {
    id: 'res-1',
    q1: 5,
    q2: 5,
    q3: 4,
    q4: 5,
    q5: 5,
    feedback: 'วิทยากรอธิบายเข้าใจง่ายมาก มีตัวอย่างจริงให้ทดลองทำ แนะนำจัดหลักสูตรขั้นสูงต่อเลยครับ!',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-2',
    q1: 4,
    q2: 5,
    q3: 5,
    q4: 4,
    q5: 5,
    feedback: 'ชอบกิจกรรม workshop กลุ่ม สนุกและได้ฝึกคิดจริง ได้แนวทางไปใช้กับทีมทันที',
    timestamp: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-3',
    q1: 5,
    q2: 4,
    q3: 4,
    q4: 4,
    q5: 4,
    feedback: 'เอกสารสไลด์ละเอียดดีมาก อยากให้เพิ่มเวลาฝึกปฏิบัติอีกนิดครับ',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-4',
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 5,
    q5: 5,
    feedback: 'คุ้มค่าเวลามาก บรรยากาศเป็นกันเอง ตอบคำถามได้เคลียร์ทุกข้อสงสัย ขอบคุณมากครับ',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-5',
    q1: 4,
    q2: 4,
    q3: 4,
    q4: 3,
    q5: 4,
    feedback: 'เนื้อหาแน่นดีมาก อยากให้มีคลิปย้อนหลังสำหรับทบทวนด้วยค่ะ',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-6',
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 4,
    q5: 5,
    feedback: 'ประทับใจมากค่ะ สามารถนำเทคนิคไปปรับใช้ในงานได้จริงทันทีในวันพรุ่งนี้',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

let responses: SurveyResponse[] = [...initialResponses];

// SSE Clients for live real-time sync
type SSEClient = {
  id: number;
  res: Response;
};
let sseClients: SSEClient[] = [];
let nextClientId = 1;

function broadcastUpdate(type: 'NEW_RESPONSE' | 'RESET' | 'SEED', data?: any) {
  const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  sseClients.forEach((client) => {
    try {
      client.res.write(`data: ${payload}\n\n`);
    } catch (err) {
      // ignore broken pipes
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Endpoints
  app.get('/api/responses', (_req: Request, res: Response) => {
    res.json({
      success: true,
      count: responses.length,
      data: responses,
    });
  });

  app.post('/api/responses', (req: Request, res: Response) => {
    const { q1, q2, q3, q4, q5, feedback, deviceFingerprint } = req.body;

    // Validate 1-5 score inputs
    const scores = [q1, q2, q3, q4, q5].map(Number);
    const isValid = scores.every((s) => !isNaN(s) && s >= 1 && s <= 5);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'กรุณาให้คะแนน 1 - 5 ให้ครบทั้ง 5 ข้อ',
      });
    }

    const newResponse: SurveyResponse = {
      id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      q1: scores[0],
      q2: scores[1],
      q3: scores[2],
      q4: scores[3],
      q5: scores[4],
      feedback: typeof feedback === 'string' ? feedback.trim() : '',
      timestamp: new Date().toISOString(),
      deviceFingerprint: typeof deviceFingerprint === 'string' ? deviceFingerprint : undefined,
    };

    responses.unshift(newResponse);
    broadcastUpdate('NEW_RESPONSE', newResponse);

    return res.status(201).json({
      success: true,
      message: 'บันทึกคำตอบเรียบร้อยแล้ว',
      data: newResponse,
    });
  });

  // Server-Sent Events (SSE) for Real-time Dashboard connection
  app.get('/api/events', (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', count: responses.length })}\n\n`);

    const clientId = nextClientId++;
    const client: SSEClient = { id: clientId, res };
    sseClients.push(client);

    req.on('close', () => {
      sseClients = sseClients.filter((c) => c.id !== clientId);
    });
  });

  // Reset survey responses
  app.delete('/api/responses', (_req: Request, res: Response) => {
    responses = [];
    broadcastUpdate('RESET');
    res.json({ success: true, message: 'ล้างข้อมูลทั้งหมดแล้ว' });
  });

  // Re-seed demo responses
  app.post('/api/seed', (_req: Request, res: Response) => {
    responses = [...initialResponses];
    broadcastUpdate('SEED', responses);
    res.json({ success: true, count: responses.length, data: responses });
  });

  // Vite middleware in dev or static serving in prod
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
