import { GoogleLogin } from '@react-oauth/google';

// Definimos que el botón va a recibir una función como propiedad
interface BotonGoogleProps {
  onGoogleSuccess: (credential: string) => Promise<void>;
}

export function BotonGoogle({ onGoogleSuccess }: BotonGoogleProps) {
  return (
    <div className="flex justify-center w-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (credentialResponse.credential) {
            await onGoogleSuccess(credentialResponse.credential);
          }
        }}
        onError={() => {
          console.error('El inicio de sesión falló');
        }}
        useOneTap
      />
    </div>
  );
}
