import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { AuthService } from '@/services/auth.service.ts';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { BotonGoogle } from './botongoogle.tsx';
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setMessageType(null);

    try {
      if (!form.email || !form.password) {
        throw new Error('Email y contraseña son obligatorios.');
      }

      if (form.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }

      const response = await AuthService.login({
        mail: form.email,
        password: form.password,
      });

      setMessageType('success');
      setMessage('¡Sesión iniciada! Redirigiendo...');

      if (response.token) {
        AuthService.saveToken(response.token, checked);
        window.dispatchEvent(new Event('userLoggedIn'));
      }

      setForm({
        email: '',
        password: '',
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setMessageType('error');
      console.error('Error:', err);

      setMessage(
        `Error: ${
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'No se pudo iniciar sesión'
        }`,
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleGoogleSuccess = async (accessToken: string) => {
    setSubmitting(true);
    setMessage(null);
    setMessageType(null);

    try {
      const response = await AuthService.logingoogle(accessToken);

      setMessageType('success');

      if (response.token) {
        AuthService.saveToken(response.token, checked);
        window.dispatchEvent(new Event('userLoggedIn'));
      }

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      if (
        err.response?.status === 404 &&
        err.response?.data?.action === 'REQUIERE_REGISTRO'
      ) {
        const prefillData = err.response.data.prefillData;
        setMessageType('error');
        setMessage('Cuenta no registrada. Redirigiendo al registro...');
        setTimeout(() => {
          navigate('/registrarse', { state: { prefillData } });
        }, 1500);
        return;
      }

      setMessageType('error');
      setMessage('No se pudo iniciar sesión con Google');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <Card className="gap-3 py-5">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <BotonGoogle onGoogleSuccess={handleGoogleSuccess} />
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                O continua con
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a
                    href="https://youtu.be/dQw4w9WgXcQ"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Te olvidaste la contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="**********"
                  required
                />
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="checkbox"
                  name="checkbox"
                  checked={checked}
                  onCheckedChange={(c) => setChecked(c as boolean)}
                />
                <FieldLabel htmlFor="checkbox">Recordame</FieldLabel>
              </Field>
              <Field>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Entrando...' : 'Iniciar Sesión'}
                </Button>
                <FieldDescription className="text-center">
                  No tenés cuenta? <a href="/registrarse">Registrate</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          {message && (
            <p
              className={`mt-4 text-sm text-center font-semibold pt-1 ${
                messageType === 'success' ? '' : 'text-red-500'
              }`}
            >
              {message}
            </p>
          )}
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Apretando continuar, significa que aceptaste nuestros{' '}
        <a href="/politicas">términos de servicio</a>
      </FieldDescription>
    </div>
  );
}
