import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const VISITS_FILE = path.resolve('./trackvis-visits.json');

function readVisits() {
  try { return JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8')); }
  catch { return []; }
}

function writeVisits(visits) {
  fs.writeFileSync(VISITS_FILE, JSON.stringify(visits, null, 2));
}

function apiMiddleware() {
  return {
    name: 'trackvis-api',
    configureServer(server) {

      // POST /api/log — called by tracker.js on every page load
      server.middlewares.use('/api/log', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
        if (req.method !== 'POST')    { next(); return; }

        let raw = '';
        req.on('data', c => { raw += c; });
        req.on('end', () => {
          try {
            const visit = JSON.parse(raw);
            visit.id          = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            visit.receivedAt  = new Date().toISOString();
            const visits = readVisits();
            visits.unshift(visit);
            writeVisits(visits.slice(0, 500));
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, id: visit.id }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Bad JSON' }));
          }
        });
      });

      // GET /api/visits — polled by the dashboard every 10 s
      server.middlewares.use('/api/visits', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        if (req.method !== 'GET') { next(); return; }
        const visits = readVisits();
        res.statusCode = 200;
        res.end(JSON.stringify(visits.slice(0, 100)));
      });

    },
  };
}

export default defineConfig({
  plugins: [react(), apiMiddleware()],
  server: {
    port: 3000,
    hmr: { overlay: false },
  },
});
