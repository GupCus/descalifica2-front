import React, { useEffect, useState } from 'react';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button.tsx';
import fondoMonza from '../../assets/Monza.jpg';
import { postBlogPostFormData } from '@/services/blogpost.service';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';

//DEFINICIONES DE CLASES
type FormState = {
  title: string;
  content: string;
};

function NuevoBlogPost() {
  const [form, setForm] = useState<FormState>({
    title: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserID] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.getCurrentUser().then((user) => {
      if (user) setUserID(user.id);
      else navigate('/login');
    });
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setMessage('Debés iniciar sesión para publicar');
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      await postBlogPostFormData(
        {
          title: form.title.trim(),
          content: form.content.trim(),
          author: userId,
        },
        selectedFile || undefined,
      );
      navigate('/foro');
    } catch (err: any) {
      setMessage(
        `Error: ${err?.response?.data?.message || err.message || 'No se pudo crear el Post'}`,
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="relative min-h-screen">
      {/* Fondo Monza blurreado */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoMonza})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(6px) brightness(0.5)',
        }}
      />

      {/* Contenido del formulario */}
      <div className="relative z-10 flex justify-center items-start min-h-screen pt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl mx-8 bg-gray-950/50 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-700/40"
        >
          <h1
            className="text-gray-200 mt-5 scroll-m-20 text-5xl font-extrabold tracking-wider text-center uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Nuevo Posteo
          </h1>

          <InputGroup className="mt-5 mb-5 w-full">
            <InputGroupInput
              placeholder="Titulo del Posteo"
              id="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup className="w-full">
              <Textarea
                placeholder="¿Que estas pensando?"
                id="content"
                rows={8}
                value={form.content}
                onChange={handleChange}
                required
                className="bg-gray-900 border-gray-700 text-gray-200 resize-none shadow-none w-full"
              />
            </InputGroup>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Imagen del Posteo (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-900 file:text-white
                hover:file:bg-green-800
                bg-gray-900 rounded-md border border-gray-700"
            />
          </div>

          <div className="flex w-full justify-between pt-4">
            <Button
              type="button"
              className="bg-transparent hover:bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-900 hover:bg-green-800 text-white font-semibold shadow-lg shadow-green-900/50 border-0"
            >
              {submitting ? 'Enviando...' : 'Crear nuevo Posteo'}
            </Button>
          </div>

          {message && (
            <p className="mt-2 text-sm text-center font-semibold text-gray-300">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
export default NuevoBlogPost;
