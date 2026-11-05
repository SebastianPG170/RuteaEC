// Unico lugar donde se llama a fetch. Cada funcion de la app pasa por aqui.
export async function api(ruta, { method = 'GET', body } = {}) {
  const res = await fetch('/api' + ruta, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'fetch' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.error || `Error ${res.status}`);
    error.status = res.status;
    error.fields = data?.fields || {};
    throw error;
  }
  return data;
}
