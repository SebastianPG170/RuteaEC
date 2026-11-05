import { api } from './api.js';

// Estado global de la sesion (equivale a un contexto en React)
export const auth = $state({ admin: null, loading: true });

export async function cargarSesion() {
  try {
    auth.admin = await api('/auth/me');
  } catch {
    auth.admin = null;
  } finally {
    auth.loading = false;
  }
}

export async function iniciarSesion(email, password) {
  auth.admin = await api('/auth/login', { method: 'POST', body: { email, password } });
}

export async function cerrarSesion() {
  await api('/auth/logout', { method: 'POST' });
  auth.admin = null;
  location.hash = '#/login';
}
