import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '@/services/auth.service.ts';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import * as React from 'react';
import {
  CalendarIcon,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Flag,
  MapPin,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { getPiloto } from '@/services/piloto.service';
import { getEscuderia } from '@/services/escuderia.service';
import { getCircuito } from '@/services/circuito.service';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type FormState = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  telegram_username: string;
  date_of_birth: Date | null;
  fav_driver: string;
  fav_team: string;
  fav_circuit: string;
  bio: string;
  avatar: File | null;
};

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const WEEKDAY_NAMES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function getUniqueNames(items: { name?: string }[]): string[] {
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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [openBirthDate, setOpenBirthDate] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prefillData = location.state?.prefillData;
  const googleAvatar = prefillData?.avatar || null;
  const [useCustomAvatar, setUseCustomAvatar] = useState(false);

  // Datalists para sugerencias
  const [pilotosList, setPilotosList] = useState<string[]>([]);
  const [escuderiasList, setEscuderiasList] = useState<string[]>([]);
  const [circuitosList, setCircuitosList] = useState<string[]>([]);

  const [form, setForm] = useState<FormState>({
    name: prefillData?.name || '',
    surname: prefillData?.surname || '',
    username: '',
    email: prefillData?.email || '',
    password: '',
    confirmPassword: '',
    telegram_username: '',
    date_of_birth: null,
    fav_driver: '',
    fav_team: '',
    fav_circuit: '',
    bio: '',
    avatar: null,
  });

  // Estado interno para la navegación en el calendario
  const currentYear = new Date().getFullYear();
  const [viewYear, setViewYear] = useState<number>(2000);
  const [viewMonth, setViewMonth] = useState<number>(0);

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setForm((s) => ({ ...s, avatar: file }));

      // Crear preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  const removeAvatar = () => {
    setForm((s) => ({ ...s, avatar: null }));
    if (previewUrl) {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleSelectDay = (day: number) => {
    const selectedDate = new Date(Date.UTC(viewYear, viewMonth, day));
    setForm((prev) => ({ ...prev, date_of_birth: selectedDate }));
    setOpenBirthDate(false);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      if (viewYear < currentYear) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      }
    } else {
      setViewMonth((m) => m + 1);
    }
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
      const trimmedTelegram = form.telegram_username.trim().replace(/^@/, '');
      if (trimmedTelegram.length > 0) {
        if (/\s/.test(trimmedTelegram)) {
          throw new Error('El usuario de Telegram no debe contener espacios.');
        }
        formData.append('telegram_username', trimmedTelegram);
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

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setMessageType('error');
      console.error('Error completo:', err);
      console.error('Respuesta del servidor:', err.response?.data);

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

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Lunes = 0

  const yearsOptions = Array.from(
    { length: currentYear - 1920 + 1 },
    (_, i) => currentYear - i,
  );

  return (
    <Card className={cn(className)} {...props}>
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
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="name">Nombre *</FieldLabel>
                <Input
                  placeholder="Nombre"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="surname">Apellido</FieldLabel>
                <Input
                  placeholder="Apellido"
                  id="surname"
                  value={form.surname}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="username">Nombre de Usuario *</FieldLabel>
                <Input
                  placeholder="Nombre de usuario"
                  id="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Correo Electrónico *</FieldLabel>
                <Input
                  placeholder="correo@ejemplo.com"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
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
                  value={form.password}
                  onChange={handleChange}
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
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="birth_date_btn">
                  Fecha de Nacimiento *
                </FieldLabel>
                <Popover open={openBirthDate} onOpenChange={setOpenBirthDate}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      id="birth_date_btn"
                      onClick={() => {
                        if (!openBirthDate && form.date_of_birth) {
                          setViewYear(form.date_of_birth.getUTCFullYear());
                          setViewMonth(form.date_of_birth.getUTCMonth());
                        }
                      }}
                      className="w-full h-9 border border-input rounded-md px-3 flex items-center justify-between text-left cursor-pointer hover:border-ring/50 transition-colors select-none bg-background text-foreground"
                    >
                      <span
                        className={
                          form.date_of_birth
                            ? 'text-foreground font-medium text-sm truncate'
                            : 'text-muted-foreground text-sm truncate'
                        }
                      >
                        {form.date_of_birth
                          ? form.date_of_birth.toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              timeZone: 'UTC',
                            })
                          : 'Seleccionar'}
                      </span>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground opacity-50 shrink-0" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-72 max-w-[calc(100vw-2rem)] p-4 bg-popover border-border text-popover-foreground shadow-2xl z-50"
                    align="start"
                  >
                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1 text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded transition-colors"
                        title="Mes anterior"
                      >
                        <ChevronLeft size={15} />
                      </button>

                      <div className="flex items-center gap-1 flex-1 justify-center">
                        <select
                          value={viewMonth}
                          onChange={(e) => setViewMonth(Number(e.target.value))}
                          className="bg-background border border-input text-foreground text-xs rounded px-1.5 py-1 outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                        >
                          {MONTH_NAMES.map((month, idx) => (
                            <option
                              key={month}
                              value={idx}
                              className="bg-background"
                            >
                              {month}
                            </option>
                          ))}
                        </select>

                        <select
                          value={viewYear}
                          onChange={(e) => setViewYear(Number(e.target.value))}
                          className="bg-background border border-input text-foreground text-xs rounded px-1.5 py-1 outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                        >
                          {yearsOptions.map((year) => (
                            <option
                              key={year}
                              value={year}
                              className="bg-background"
                            >
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextMonth}
                        disabled={
                          viewYear >= currentYear &&
                          viewMonth >= new Date().getMonth()
                        }
                        className="p-1 text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mes siguiente"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-1">
                      {WEEKDAY_NAMES.map((d) => (
                        <span
                          key={d}
                          className="text-[10px] font-semibold text-muted-foreground select-none"
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-7 w-7" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNumber = i + 1;
                        const isSelected =
                          form.date_of_birth &&
                          form.date_of_birth.getUTCFullYear() === viewYear &&
                          form.date_of_birth.getUTCMonth() === viewMonth &&
                          form.date_of_birth.getUTCDate() === dayNumber;

                        return (
                          <button
                            key={dayNumber}
                            type="button"
                            onClick={() => handleSelectDay(dayNumber)}
                            className={`h-7 w-7 text-xs rounded-md flex items-center justify-center transition-all cursor-pointer select-none ${
                              isSelected
                                ? 'bg-primary text-primary-foreground font-bold shadow-md'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            {dayNumber}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </Field>

              <Field>
                <FieldLabel htmlFor="telegram_username">
                  Telegram (opcional)
                </FieldLabel>
                <Input
                  placeholder="Sin @"
                  id="telegram_username"
                  value={form.telegram_username}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="border-t border-border pt-4 mt-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wider flex items-center gap-1.5">
                <Trophy size={14} className="text-muted-foreground" />
                Preferencias y Favoritos (opcional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="fav_driver"
                    className="flex items-center gap-1"
                  >
                    <Trophy size={12} className="text-muted-foreground" />
                    Piloto Favorito
                  </FieldLabel>
                  <Input
                    list="pilotos-reg-list"
                    placeholder="ej. Colapinto"
                    id="fav_driver"
                    value={form.fav_driver}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="fav_team"
                    className="flex items-center gap-1"
                  >
                    <Flag size={12} className="text-muted-foreground" />
                    Escudería Favorita
                  </FieldLabel>
                  <Input
                    list="escuderias-reg-list"
                    placeholder="ej. Williams"
                    id="fav_team"
                    value={form.fav_team}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="fav_circuit"
                    className="flex items-center gap-1"
                  >
                    <MapPin size={12} className="text-muted-foreground" />
                    Circuito Favorito
                  </FieldLabel>
                  <Input
                    list="circuitos-reg-list"
                    placeholder="ej. Monza"
                    id="fav_circuit"
                    value={form.fav_circuit}
                    onChange={handleChange}
                  />
                </Field>
              </div>
            </div>

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

            <Field>
              <FieldLabel>Foto de Perfil (opcional)</FieldLabel>
              {googleAvatar && !useCustomAvatar ? (
                <div className="relative border border-border rounded-lg p-3 bg-background flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={googleAvatar}
                      alt="Foto de perfil de Google"
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 rounded-full object-cover border-2 border-primary shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        Foto de tu cuenta de Google
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Se usará automáticamente como tu foto de perfil.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUseCustomAvatar(true)}
                    className="text-xs h-8 shrink-0 cursor-pointer"
                  >
                    Cambiar foto
                  </Button>
                </div>
              ) : !form.avatar ? (
                <div className="space-y-2">
                  <div
                    {...getRootProps()}
                    className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      isDragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:border-accent-foreground/50 bg-background'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground font-medium truncate">
                      {isDragActive
                        ? 'Suelta la imagen aquí...'
                        : 'Arrastra una foto o haz clic para subirla (PNG, JPG, WEBP)'}
                    </p>
                  </div>
                  {googleAvatar && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeAvatar();
                          setUseCustomAvatar(false);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground cursor-pointer h-7"
                      >
                        Usar foto de Google
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative border border-border rounded-lg p-2 bg-background">
                  <div className="flex items-center gap-3">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-10 w-10 rounded-full object-cover border-2 border-primary shadow-md shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {form.avatar.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(form.avatar.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        removeAvatar();
                        if (googleAvatar) {
                          setUseCustomAvatar(false);
                        }
                      }}
                      className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground cursor-pointer h-auto py-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Field>

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
