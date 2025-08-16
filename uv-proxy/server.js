import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { createBareServer } from '@tomphttp/bare-server-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const bare = createBareServer('/bare/'); // Bare TCP/HTTP tunnel used by UV

// Basic hardening & perf
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(cors());
app.use(morgan('tiny'));

// Static assets
app.use('/uv', express.static(path.join(__dirname, 'public/uv')));
app.use(express.static(path.join(__dirname, 'public')));

// Ultraviolet config endpoint used by client
app.get('/uv/uv.config.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'uv.config.js'));
});

// Health check
app.get('/health', (_, res) => res.json({ ok: true }));

// Anything else -> index.html (single-page app)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Wire bare server
server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) bare.routeRequest(req, res);
});
server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) bare.routeUpgrade(req, socket, head);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`uv-proxy running on http://localhost:${PORT}`);
});
