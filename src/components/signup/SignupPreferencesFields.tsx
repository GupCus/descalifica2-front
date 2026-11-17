import * as React from 'react';
import { Trophy, Flag, MapPin } from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface SignupPreferencesValues {
  fav_driver: string;
  fav_team: string;
  fav_circuit: string;
}

export interface SignupPreferencesFieldsProps {
  values: SignupPreferencesValues;
  pilotosList: string[];
  escuderiasList: string[];
  circuitosList: string[];
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export function SignupPreferencesFields({
  values,
  pilotosList,
  escuderiasList,
  circuitosList,
  onChange,
}: SignupPreferencesFieldsProps) {
  return (
    <div className="border-t border-border pt-4 mt-2">
      <datalist id="pilotos-reg-list">
        {pilotosList.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <datalist id="escuderias-reg-list">
        {escuderiasList.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>
      <datalist id="circuitos-reg-list">
        {circuitosList.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wider flex items-center gap-1.5">
        <Trophy size={14} className="text-muted-foreground" />
        Preferencias y Favoritos (opcional)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field>
          <FieldLabel htmlFor="fav_driver" className="flex items-center gap-1">
            <Trophy size={12} className="text-muted-foreground" />
            Piloto Favorito
          </FieldLabel>
          <Input
            list="pilotos-reg-list"
            placeholder="ej. Colapinto"
            id="fav_driver"
            value={values.fav_driver}
            onChange={onChange}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="fav_team" className="flex items-center gap-1">
            <Flag size={12} className="text-muted-foreground" />
            Escudería Favorita
          </FieldLabel>
          <Input
            list="escuderias-reg-list"
            placeholder="ej. Williams"
            id="fav_team"
            value={values.fav_team}
            onChange={onChange}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="fav_circuit" className="flex items-center gap-1">
            <MapPin size={12} className="text-muted-foreground" />
            Circuito Favorito
          </FieldLabel>
          <Input
            list="circuitos-reg-list"
            placeholder="ej. Monza"
            id="fav_circuit"
            value={values.fav_circuit}
            onChange={onChange}
          />
        </Field>
      </div>
    </div>
  );
}
