import { useState, useCallback } from 'react';
import * as React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthService } from '@/services/auth.service.ts';
import { useFavoritosCatalogs } from '@/hooks/useFavoritosCatalogs';
import { useTelegramLink } from '@/hooks/useTelegramLink';
import { BirthDatePicker } from '@/components/BirthDatePicker';
import { TelegramLinkField } from '@/components/TelegramLinkField';
import { SignupPersonalFields } from '@/components/signup/SignupPersonalFields';
import { SignupPreferencesFields } from '@/components/signup/SignupPreferencesFields';
import { SignupAvatarField } from '@/components/signup/SignupAvatarField';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

type FormState = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  date_of_birth: Date | null;
  fav_driver: string;
  fav_team: string;
  fav_circuit: string;
  bio: string;
  avatar: File | null;
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prefillData = location.state?.prefillData;
  const googleAvatar = prefillData?.avatar || null;
  const [useCustomAvatar, setUseCustomAvatar] = useState(false);

  const { pilotosList, escuderiasList, circuitosList } = useFavoritosCatalogs();

  const {
    telegramLinked,
    telegramPending,
    telegramOtp,
    telegramUsername,
    linkingTelegram,
    handleLinkTelegram,
    handleCancelPending,
    handleUnlinkTelegram,
    resetTelegram,
  } = useTelegramLink({
    mode: 'registration',
    onMessage: (msg, type) => {
      setMessage(msg);
      setMessageType(type);
    },
  });

  const [form, setForm] = useState<FormState>({
    name: prefillData?.name || '',
    surname: prefillData?.surname || '',
    username: '',
    email: prefillData?.email || '',
    password: '',
    confirmPassword: '',
    date_of_birth: null,
    fav_driver: '',
    fav_team: '',
    fav_circuit: '',
    bio: '',
    avatar: null,
  });

  const handleSelectAvatar = useCallback((file: File) => {
    setForm((s) => ({ ...s, avatar: file }));
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const removeAvatar = useCallback(() => {
    setForm((s) => ({ ...s, avatar: null }));
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      if (
        !form.email ||
        !form.password ||
        !form.confirmPassword ||
        !form.name ||
        !form.username ||
        !form.date_of_birth
      ) {
        throw new Error('Todos los campos obligatorios deben ser completados.');
      }

      if (form.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }

      if (form.password !== form.confirmPassword) {
        throw new Error('Las contraseñas no coinciden.');
      }

      const birthDateString = `${form.date_of_birth.getUTCFullYear()}-${String(
        form.date_of_birth.getUTCMonth() + 1,
      ).padStart(2, '0')}-${String(form.date_of_birth.getUTCDate()).padStart(
        2,
        '0',
      )}`;

      const formData = new FormData();
      formData.append('email', form.email.trim());
      formData.append('password', form.password);
      formData.append('username', form.username.trim());
      formData.append('date_of_birth', birthDateString);
      formData.append('name', form.name.trim());
      if (form.surname.trim()) {
        formData.append('surname', form.surname.trim());
      }
      if (form.fav_driver.trim()) {
        formData.append('fav_driver', form.fav_driver.trim());
      }
      if (form.fav_team.trim()) {
        formData.append('fav_team', form.fav_team.trim());
      }
      if (form.fav_circuit.trim()) {
        formData.append('fav_circuit', form.fav_circuit.trim());
      }
      if (form.bio.trim()) {
        formData.append('bio', form.bio.trim());
      }
      if (form.avatar) {
        formData.append('avatar', form.avatar);
      } else if (googleAvatar && !useCustomAvatar) {
        formData.append('avatar_url', googleAvatar);
      }

      if (telegramLinked && telegramOtp) {
        formData.append('telegram_code', telegramOtp);
        if (telegramUsername) {
          formData.append('telegram_username', telegramUsername);
        }
      }

      const response = await AuthService.RegisterUser(formData);

      setMessageType('success');
      setMessage(
        response?.message ||
          '¡Usuario creado con éxito! Redirigiendo al login...',
      );

      if (response?.token) {
        AuthService.saveToken(response.token);
        window.dispatchEvent(new Event('userLoggedIn'));
      }

      setForm({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        date_of_birth: null,
        fav_driver: '',
        fav_team: '',
        fav_circuit: '',
        bio: '',
        avatar: null,
      });
      removeAvatar();
      resetTelegram();

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setMessageType('error');

      setMessage(
        `Error: ${
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'No se pudo crear el usuario'
        }`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle
          className="text-xl sm:text-2xl uppercase tracking-wider font-bold text-foreground"
          style={{ fontFamily: "'Orbitron', 'Rajdhani', sans-serif" }}
        >
          Crear Cuenta
        </CardTitle>
        <CardDescription>Únete a la comunidad de Descalifica2</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <SignupPersonalFields values={form} onChange={handleChange} />

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="birth_date_btn">
                  Fecha de Nacimiento *
                </FieldLabel>
                <BirthDatePicker
                  id="birth_date_btn"
                  value={form.date_of_birth}
                  onChange={(selectedDate) =>
                    setForm((prev) => ({
                      ...prev,
                      date_of_birth: selectedDate,
                    }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Telegram (opcional)</FieldLabel>
                <TelegramLinkField
                  telegramLinked={telegramLinked}
                  telegramPending={telegramPending}
                  telegramUsername={telegramUsername}
                  telegramOtp={telegramOtp}
                  linkingTelegram={linkingTelegram}
                  allowUnlink={true}
                  onLink={handleLinkTelegram}
                  onCancelPending={handleCancelPending}
                  onUnlink={handleUnlinkTelegram}
                />
              </Field>
            </div>

            <SignupPreferencesFields
              values={form}
              pilotosList={pilotosList}
              escuderiasList={escuderiasList}
              circuitosList={circuitosList}
              onChange={handleChange}
            />

            <Field className="border-t border-border pt-4 mt-2">
              <FieldLabel htmlFor="bio">Sobre Mí (opcional)</FieldLabel>
              <textarea
                id="bio"
                placeholder="Cuéntanos un poco sobre ti..."
                value={form.bio}
                onChange={handleChange}
                rows={2}
                className="w-full bg-background border border-input text-foreground rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none"
              />
            </Field>

            <SignupAvatarField
              avatar={form.avatar}
              previewUrl={previewUrl}
              googleAvatar={googleAvatar}
              useCustomAvatar={useCustomAvatar}
              onSelectAvatar={handleSelectAvatar}
              onRemoveAvatar={removeAvatar}
              onSetUseCustomAvatar={setUseCustomAvatar}
            />

            <Field className="pt-2">
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </Field>

            {message && (
              <p
                className={`text-sm text-center font-semibold ${
                  messageType === 'success'
                    ? 'text-green-500'
                    : 'text-destructive'
                }`}
              >
                {message}
              </p>
            )}

            <div className="text-center pt-4">
              <span className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Iniciar Sesión
                </Link>
              </span>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
