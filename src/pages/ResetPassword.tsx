import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import fondoLogin from '../assets/grilla-cola-2021.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AuthService } from '@/services/auth.service.ts';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('Token de recuperación no encontrado en el enlace.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);

    try {
      await AuthService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Error al restablecer contraseña:', err);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          'No se pudo restablecer la contraseña. El enlace puede haber expirado.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoLogin})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(6px) brightness(0.35)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center mb-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Ir a iniciar sesión
          </Link>
        </div>

        <Card className="gap-3 py-5">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Restablecer Contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            {!token ? (
              <div className="flex flex-col items-center text-center gap-4 py-3">
                <div className="rounded-full bg-red-500/10 p-3 text-red-500">
                  <AlertCircle size={40} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-base">Enlace inválido</h3>
                  <p className="text-sm text-muted-foreground">
                    Este enlace de recuperación no contiene un token válido o está incompleto.
                  </p>
                </div>
                <div className="w-full pt-2">
                  <Link to="/forgot-password">
                    <Button className="w-full">
                      Solicitar nuevo enlace
                    </Button>
                  </Link>
                </div>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center text-center gap-4 py-3">
                <div className="rounded-full bg-green-500/10 p-3 text-green-500">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-base">¡Contraseña actualizada!</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu contraseña ha sido restablecida con éxito. Te estamos redirigiendo al inicio de sesión...
                  </p>
                </div>
                <div className="w-full pt-2">
                  <Link to="/login">
                    <Button className="w-full">
                      Iniciar sesión ahora
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <p className="text-sm text-muted-foreground text-center">
                    Ingresa tu nueva contraseña para acceder a tu cuenta.
                  </p>

                  <Field>
                    <FieldLabel htmlFor="new-password">Nueva contraseña</FieldLabel>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Al menos 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm-password">Confirmar nueva contraseña</FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Repite tu nueva contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Field>

                  {errorMessage && (
                    <p className="text-sm text-red-500 text-center font-medium">
                      {errorMessage}
                    </p>
                  )}

                  <Field>
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? 'Guardando nueva contraseña...' : 'Restablecer contraseña'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResetPassword;
