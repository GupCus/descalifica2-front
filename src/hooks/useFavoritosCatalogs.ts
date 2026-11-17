import { useEffect, useState } from 'react';
import { getPiloto } from '@/services/piloto.service';
import { getEscuderia } from '@/services/escuderia.service';
import { getCircuito } from '@/services/circuito.service';

export function getUniqueNames(items: { name?: string }[]): string[] {
  const map = new Map<string, string>();
  items.forEach((item) => {
    const trimmed = item.name?.trim();
    if (trimmed) {
      const normalized = trimmed.toLowerCase();
      if (!map.has(normalized)) {
        map.set(normalized, trimmed);
      }
    }
  });
  return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
}

export function useFavoritosCatalogs() {
  const [pilotosList, setPilotosList] = useState<string[]>([]);
  const [escuderiasList, setEscuderiasList] = useState<string[]>([]);
  const [circuitosList, setCircuitosList] = useState<string[]>([]);

  useEffect(() => {
    getPiloto()
      .then((res) => setPilotosList(getUniqueNames(res)))
      .catch(() => {});
    getEscuderia()
      .then((res) => setEscuderiasList(getUniqueNames(res)))
      .catch(() => {});
    getCircuito()
      .then((res) => setCircuitosList(getUniqueNames(res)))
      .catch(() => {});
  }, []);

  return {
    pilotosList,
    escuderiasList,
    circuitosList,
  };
}
