/**
 * Genera la URL completa para acceder a un asset público.
 * @param relativePath La ruta del asset guardada (por ejemplo, en el usuario).
 * @returns La URL completa en formato string lista para usar en un <img src={...} />.
 */
export function getAssetUrl(relativePath: string | undefined | null): string {
  //DEBUG
  console.log('RUTA: ' + relativePath);
  if (!relativePath) {
    // Retornamos un string vacío si no hay asset
    return '';
  }

  // Si ya es una URL completa, la retornamos tal cual
  if (relativePath.startsWith('http')) {
    return relativePath;
  }

  // Usamos la URL de la API base definida en el entorno
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Limpiamos la ruta por si ya trae una barra inicial para evitar doble barra (//)
  const cleanPath = relativePath.startsWith('/')
    ? relativePath.slice(1)
    : relativePath;

  // DEBUG
  console.log('RUTA COMPLETA:' + `${baseUrl}/assets/${cleanPath}`);
  const rutaCompleta = `${baseUrl}/assets/${cleanPath}`;
  return rutaCompleta.toLowerCase();
}
