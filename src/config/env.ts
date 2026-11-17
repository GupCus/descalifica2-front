function getRequiredEnv(key: 'VITE_API_URL'): string {
  const rawValue = import.meta.env[key];
  const value = typeof rawValue === 'string' ? rawValue.trim() : '';

  if (!value) {
    if (import.meta.env.MODE === 'test') {
      return 'http://localhost:3000/api';
    }
    const message = `[Config] Falta la variable de entorno obligatoria ${key}. Definila en el archivo .env (ver .env.example).`;
    if (typeof document !== 'undefined') {
      const root = document.getElementById('root') ?? document.body;
      if (root) {
        root.innerHTML = `<div style="padding:24px;font-family:system-ui,sans-serif;color:#fecaca;background:#450a0a;border:1px solid #dc2626;border-radius:8px;margin:24px;"><strong>Error de configuración:</strong> ${message}</div>`;
      }
    }
    throw new Error(message);
  }

  return value.replace(/\/+$/, '');
}

export const API_URL: string = getRequiredEnv('VITE_API_URL');

export const GOOGLE_CLIENT_ID: string = (
  import.meta.env.VITE_GOOGLE_KEY ?? ''
).trim();

/**
 * Construye una URL completa hacia un endpoint de la API garantizando una única barra intermedia.
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.replace(/^\/+/, '');
  return cleanPath ? `${API_URL}/${cleanPath}` : API_URL;
}

/**
 * Genera la URL completa para acceder a un asset público servido por el backend.
 * @param relativePath La ruta relativa del asset guardada en la entidad.
 * @returns La URL completa lista para usar en <img src={...} /> o string vacío si no hay asset.
 */
export function getAssetUrl(relativePath: string | undefined | null): string {
  if (!relativePath) {
    return '';
  }

  if (/^https?:\/\//i.test(relativePath)) {
    return relativePath;
  }

  let cleanPath = relativePath.replace(/^\/+/, '');

  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath.replace(/^uploads\/+/, '');
  }

  if (cleanPath.startsWith('assets/')) {
    cleanPath = cleanPath.replace(/^assets\/+/, '');
  }

  return getApiUrl(`assets/${cleanPath}`);
}
