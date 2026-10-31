/**
 * API de prueba (en memoria) con el mismo contrato que espera el front.
 * Úsala solo para desarrollo:  npm run mock-api
 *   Login de prueba -> email: admin@demo.com | password: 123456
 */
import http from 'node:http';
import fs from 'node:fs';
const DB = new URL('./datos.json', import.meta.url);

const PORT = process.env.PORT || 3000;
const TOKEN = 'token-demo';

let siguienteId = 3;
let experiencias = [
  {
    id: 1,
    cargo: 'Desarrollador Web Junior',
    empresa: 'Proyecto académico',
    ubicacion: 'Cartagena, Colombia',
    fechaInicio: '2025-02-01',
    fechaFin: null,
    descripcion: 'Desarrollo de interfaces con HTML, CSS y JavaScript y consumo de APIs REST.',
  },
  {
    id: 2,
    cargo: 'Auxiliar de laboratorio de electrónica',
    empresa: 'Universidad de Cartagena',
    ubicacion: 'Cartagena, Colombia',
    fechaInicio: '2024-02-01',
    fechaFin: '2024-11-30',
    descripcion: 'Apoyo en prácticas con Arduino, sensores y microcontroladores.',
  },
];

try {
  const d = JSON.parse(fs.readFileSync(DB, 'utf8'));
  experiencias = d.experiencias; siguienteId = d.siguienteId;
} catch {}
const guardar = () => fs.writeFileSync(DB, JSON.stringify({ experiencias, siguienteId }, null, 2));

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

const enviar = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json', ...cors });
  res.end(data === undefined ? '' : JSON.stringify(data));
};

const leerBody = (req) =>
  new Promise((resolve) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => {
      try { resolve(b ? JSON.parse(b) : {}); } catch { resolve(null); }
    });
  });

function validar(b) {
  if (!b || !b.cargo || !b.empresa || !b.fechaInicio || !b.descripcion)
    return 'cargo, empresa, fechaInicio y descripcion son obligatorios';
  return null;
}

http
  .createServer(async (req, res) => {
    if (req.method === 'OPTIONS') return enviar(res, 204);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const partes = url.pathname.replace(/\/$/, '').split('/').filter(Boolean); // ['api', ...]
    if (partes[0] !== 'api') return enviar(res, 404, { message: 'Ruta no encontrada' });

    // POST /api/auth/login
    if (partes[1] === 'auth' && partes[2] === 'login' && req.method === 'POST') {
      const b = await leerBody(req);
      if (b?.email === 'admin@demo.com' && b?.password === '123456')
        return enviar(res, 200, { token: TOKEN });
      return enviar(res, 401, { message: 'Credenciales inválidas' });
    }

    if (partes[1] !== 'experiencias') return enviar(res, 404, { message: 'Ruta no encontrada' });
    const id = partes[2] ? Number(partes[2]) : null;

    // Lectura pública; escritura protegida
    if (req.method !== 'GET' && req.headers.authorization !== `Bearer ${TOKEN}`)
      return enviar(res, 401, { message: 'No autorizado' });

    if (req.method === 'GET' && !id) return enviar(res, 200, experiencias);

    if (req.method === 'GET') {
      const e = experiencias.find((x) => x.id === id);
      return e ? enviar(res, 200, e) : enviar(res, 404, { message: 'No existe esa experiencia' });
    }

    if (req.method === 'POST' && !id) {
      const b = await leerBody(req);
      const err = validar(b);
      if (err) return enviar(res, 400, { message: err });
      const nueva = { id: siguienteId++, ...b };
      experiencias.push(nueva); guardar();
      return enviar(res, 201, nueva);
    }

    if (req.method === 'PUT' && id) {
      const b = await leerBody(req);
      const err = validar(b);
      if (err) return enviar(res, 400, { message: err });
      const i = experiencias.findIndex((x) => x.id === id);
      if (i < 0) return enviar(res, 404, { message: 'No existe esa experiencia' });
      experiencias[i] = { ...experiencias[i], ...b, id }; guardar();
      return enviar(res, 200, experiencias[i]);
    }

    if (req.method === 'DELETE' && id) {
      const antes = experiencias.length;
      experiencias = experiencias.filter((x) => x.id !== id); guardar();
      return experiencias.length === antes
        ? enviar(res, 404, { message: 'No existe esa experiencia' })
        : enviar(res, 204);
    }

    enviar(res, 405, { message: 'Método no permitido' });
  })
  .listen(PORT, () => console.log(`API de prueba en http://localhost:${PORT}/api`));
