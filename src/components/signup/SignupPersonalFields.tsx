import * as React from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface SignupPersonalValues {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupPersonalFieldsProps {
  values: SignupPersonalValues;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export function SignupPersonalFields({
  values,
  onChange,
}: SignupPersonalFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="name">Nombre *</FieldLabel>
          <Input
            placeholder="Nombre"
            id="name"
            value={values.name}
            onChange={onChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="surname">Apellido</FieldLabel>
          <Input
            placeholder="Apellido"
            id="surname"
            value={values.surname}
            onChange={onChange}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="username">Nombre de Usuario *</FieldLabel>
          <Input
            placeholder="Nombre de usuario"
            id="username"
            value={values.username}
            onChange={onChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Correo Electrónico *</FieldLabel>
          <Input
            placeholder="correo@ejemplo.com"
            id="email"
            type="email"
            value={values.email}
            onChange={onChange}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="password">Contraseña *</FieldLabel>
          <Input
            placeholder="Mín. 6 caracteres"
            id="password"
            type="password"
            value={values.password}
            onChange={onChange}
            required
            minLength={6}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirmar *</FieldLabel>
          <Input
            placeholder="Repite contraseña"
            id="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={onChange}
            required
            minLength={6}
          />
        </Field>
      </div>
    </>
  );
}
