import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
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

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      if (!email.trim()) {
        throw new Error('Por favor ingresa tu correo electrónico.');
      }

      await AuthService.forgotPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      console.error('Error al solicitar recuperación:', err);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          'Ocurrió un error al procesar tu solicitud. Intenta nuevamente.',
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
            Volver a iniciar sesión
          </Link>
        </div>

        <Card className="gap-3 py-5">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Recuperar Contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center text-center gap-4 py-3">
                <div className="rounded-full bg-green-500/10 p-3 text-green-500">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-base">¡Solicitud enviada!</h3>
                  <p className="text-sm text-muted-foreground">
                    Si la dirección <strong className="text-foreground">{email}</strong> está registrada, te hemos enviado un enlace para restablecer tu contraseña.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recuerda revisar también tu carpeta de correo no deseado (spam). El enlace expira en 15 minutos.
                </p>
                <div className="w-full pt-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Volver al inicio de sesión
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <p className="text-sm text-muted-foreground text-center">
                    Ingresa tu correo electrónico y te enviaremos un enlace seguro para restablecer tu contraseña.
                  </p>

                  <Field>
                    <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </Field>

                  {errorMessage && (
                    <p className="text-sm text-red-500 text-center font-medium">
                      {errorMessage}
                    </p>
                  )}

                  <Field>
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? 'Enviando instrucciones...' : 'Enviar enlace de recuperación'}
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

export default ForgotPassword;
