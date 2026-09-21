import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ── In-memory store ─────────────────────────────────── */

const enquiries = [];
let nextId = 1;

/* ── POST /api/contact ───────────────────────────────── */

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are all required.',
    });
  }

  const entry = {
    id: nextId++,
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    submittedAt: new Date().toISOString(),
  };

  enquiries.push(entry);
  console.log(`[contact] New enquiry #${entry.id} from ${entry.email}`);

  return res.status(200).json({ success: true, message: 'Enquiry submitted successfully.' });
});

/* ── GET /api/contact (dev helper) ──────────────────── */

app.get('/api/contact', (_req, res) => {
  res.json({ success: true, enquiries });
});

/* ── Start ───────────────────────────────────────────── */

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
