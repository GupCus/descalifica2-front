import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import fondoLogin from '../assets/grilla-cola-2021.jpg';
import { LoginForm } from '@/components/login-form.tsx';

function Login() {
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
        <div className="flex items-center mb-1.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-s text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
