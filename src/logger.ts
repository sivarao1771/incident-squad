// Minimal JSON-lines logger. Writes to logs/app.log so the triage agent has real logs to read.

import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');
const quiet = process.env.NODE_ENV === 'test';

type Level = 'info' | 'warn' | 'error';

export function log(level: Level, msg: string, fields: Record<string, unknown> = {}): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...fields });
  if (quiet) return;
  console.log(line);
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch {
    // Logging must never take the app down.
  }
}
