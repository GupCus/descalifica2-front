import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { getPiloto } from "@/services/piloto.service.ts";
import { getEscuderia } from "@/services/escuderia.service.ts";
import { getCircuito } from "@/services/circuito.service.ts";
import { getMarca } from "@/services/marca.service.ts";
import { getTemporada } from "@/services/temporada.service.ts";

type SearchItem = {
  id: number;
  name: string;
  type: string;
  path: string;
};

type LoadableEntity = {
  id?: number;
  name?: string;
  year?: number | string;
};

const MAX_RESULTS = 8;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

function HeaderSearch() {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loaders: [string, string, Promise<LoadableEntity[]>][] = [
      ["Piloto", "/piloto", getPiloto()],
      ["Escudería", "/escuderia", getEscuderia()],
      ["Circuito", "/circuito", getCircuito()],
      ["Marca", "/marca", getMarca()],
      ["Temporada", "/temporada", getTemporada()],
    ];

    Promise.allSettled(loaders.map(([, , promise]) => promise)).then(
      (results) => {
        const uniqueItems = new Map<string, SearchItem>();
        results.forEach((result, index) => {
          if (result.status !== "fulfilled") return;
          const [type, path] = loaders[index];
          result.value.forEach((entity) => {
            if (entity.id == null) return;
            const label = (entity.name ?? String(entity.year ?? "")).trim();
            if (label.length === 0) return;

            const key = `${type}:${normalize(label)}`;
            const existing = uniqueItems.get(key);

            if (!existing || entity.id > existing.id) {
              uniqueItems.set(key, {
                id: entity.id,
                name: label,
                type,
                path,
              });
            }
          });
        });
        setItems(Array.from(uniqueItems.values()));
      }
    );
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (query.trim().length === 0) return [];
    const normalizedQuery = normalize(query.trim());
    return items
      .filter((item) => normalize(item.name).includes(normalizedQuery))
      .slice(0, MAX_RESULTS);
  }, [items, query]);

  const goTo = (item: SearchItem) => {
    setOpen(false);
    setQuery("");
    navigate(`${item.path}/${item.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
    if (event.key === "Enter" && results.length > 0) {
      goTo(results[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <ButtonGroup className="w-60 lg:w-72">
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar pilotos, escuderías..."
          aria-label="Buscar"
          className="border-gray-600/70 bg-white/5 text-sm text-white placeholder:text-gray-400"
        />
        <Button
          variant="outline"
          size="icon"
          aria-label="Buscar"
          className="border-gray-600/70 bg-transparent text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <SearchIcon />
        </Button>
      </ButtonGroup>

      {open && query.trim().length > 0 && (
        <div className="absolute top-full right-0 left-0 mt-2 overflow-hidden rounded-md border border-gray-800 bg-black/90 shadow-xl backdrop-blur-xl">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-gray-400">Sin resultados</p>
          ) : (
            <ul>
              {results.map((item) => (
                <li key={`${item.path}-${item.id}`}>
                  <button
                    onClick={() => goTo(item)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-200 hover:bg-white/10"
                  >
                    <span className="truncate">{item.name}</span>
                    <span className="ml-3 shrink-0 text-xs text-gray-500">
                      {item.type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderSearch;
