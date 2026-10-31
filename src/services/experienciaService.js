import { request } from './http.js';
import { ENDPOINTS, FIELDS } from './config.js';

const F = FIELDS;

/** Convierte cualquier fecha ISO ("2024-03-01T00:00:00Z") al formato yyyy-mm-dd. */
const soloFecha = (v) => (v ? String(v).slice(0, 10) : '');

/** API -> modelo interno */
export function fromApi(raw) {
  return {
    id: raw[F.id] ?? raw._id,
    cargo: raw[F.cargo] ?? '',
    empresa: raw[F.empresa] ?? '',
    ubicacion: raw[F.ubicacion] ?? '',
    fechaInicio: soloFecha(raw[F.fechaInicio]),
    fechaFin: soloFecha(raw[F.fechaFin]),
    descripcion: raw[F.descripcion] ?? '',
  };
}

/** Modelo interno -> API */
export function toApi(exp) {
  return {
    [F.cargo]: exp.cargo.trim(),
    [F.empresa]: exp.empresa.trim(),
    [F.ubicacion]: exp.ubicacion.trim(),
    [F.fechaInicio]: exp.fechaInicio,
    [F.fechaFin]: exp.fechaFin || null,
    [F.descripcion]: exp.descripcion.trim(),
  };
}

/** Acepta respuestas tipo [..], { data: [..] } o { experiencias: [..] } */
function extraerLista(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.experiencias)) return data.experiencias;
  return [];
}

function extraerItem(data) {
  return data && data.data && !Array.isArray(data.data) ? data.data : data;
}

/** Más recientes primero; las que siguen vigentes (sin fecha fin) arriba. */
function ordenar(lista) {
  return [...lista].sort((a, b) => {
    if (!a.fechaFin && b.fechaFin) return -1;
    if (a.fechaFin && !b.fechaFin) return 1;
    return b.fechaInicio.localeCompare(a.fechaInicio);
  });
}

export const experienciaService = {
  async listar(signal) {
    const data = await request(ENDPOINTS.experiencias, { signal });
    return ordenar(extraerLista(data).map(fromApi));
  },

  async obtener(id) {
    const data = await request(`${ENDPOINTS.experiencias}/${id}`);
    return fromApi(extraerItem(data));
  },

  async crear(exp) {
    const data = await request(ENDPOINTS.experiencias, { method: 'POST', body: toApi(exp) });
    return fromApi(extraerItem(data));
  },

  async actualizar(id, exp) {
    const data = await request(`${ENDPOINTS.experiencias}/${id}`, {
      method: 'PUT',
      body: toApi(exp),
    });
    return data ? fromApi(extraerItem(data)) : { ...exp, id };
  },

  async eliminar(id) {
    await request(`${ENDPOINTS.experiencias}/${id}`, { method: 'DELETE' });
  },
};
