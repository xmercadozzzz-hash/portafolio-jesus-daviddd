import { request, tokenStore } from './http.js';
import { ENDPOINTS, LOGIN_FIELDS } from './config.js';

export const authService = {
  async login(usuario, clave) {
    const data = await request(ENDPOINTS.login, {
      method: 'POST',
      body: { [LOGIN_FIELDS.usuario]: usuario, [LOGIN_FIELDS.clave]: clave },
    });
    const token = data?.token || data?.accessToken || data?.access_token;
    if (!token) throw new Error('La API no devolvió un token de acceso.');
    tokenStore.set(token);
    return token;
  },
  logout() {
    tokenStore.clear();
  },
};
