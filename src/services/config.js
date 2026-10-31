/**
 * Contrato con la API de la unidad 3.
 * Si tus rutas o nombres de campos son distintos, SOLO tienes que ajustar este archivo.
 */

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

export const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED !== 'false';

export const ENDPOINTS = {
  experiencias: '/experiencias', // GET (lista), POST (crear)  ->  /experiencias/:id GET, PUT, DELETE
  login: '/auth/login', // POST { email, password } -> { token }
};

/** Nombres de los campos que envía/recibe tu API (clave interna: nombre en la API). */
export const FIELDS = {
  id: 'id',
  cargo: 'cargo',
  empresa: 'empresa',
  ubicacion: 'ubicacion',
  fechaInicio: 'fechaInicio',
  fechaFin: 'fechaFin',
  descripcion: 'descripcion',
};

/** Campos que usa el formulario de login. */
export const LOGIN_FIELDS = {
  usuario: 'email',
  clave: 'password',
};
