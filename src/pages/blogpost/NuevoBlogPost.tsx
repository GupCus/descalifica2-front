import React, { useEffect, useState, useRef } from 'react';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge';
import fondoMonza from '../../assets/Monza.jpg';
import { postBlogPostFormData } from '@/services/blogpost.service';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';
import { X } from 'lucide-react';

//DEFINICIONES DE CLASES
type FormState = {
  title: string;
  content: string;
};

const MAX_TAGS = 5;

function NuevoBlogPost() {
  const [form, setForm] = useState<FormState>({
    title: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserID] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);
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

  const addTag = (rawTag: string) => {
    const tag = rawTag.trim().toLowerCase();
    if (!tag) return;
    if (tags.includes(tag)) {
      setTagInput('');
      return;
    }
    if (tags.length >= MAX_TAGS) {
      setMessage(`Podés agregar hasta ${MAX_TAGS} tags.`);
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, tag]);
    setTagInput('');
    setMessage(null);
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
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
          tags: tags.length > 0 ? tags : undefined,
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

          {/* Sección de Tags */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Tags (Opcional)
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Agregá hasta {MAX_TAGS} tags para categorizar tu post. Presioná Enter o coma para agregar.
            </p>
            <div
              className="flex flex-wrap items-center gap-2 bg-gray-900 rounded-md border border-gray-700 px-3 py-2 min-h-[42px] cursor-text"
              onClick={() => tagInputRef.current?.focus()}
            >
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-emerald-900/70 text-emerald-100 border-emerald-700/50 hover:bg-emerald-800/70 gap-1 pr-1 cursor-default"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(tag);
                    }}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-emerald-700/50 transition-colors cursor-pointer"
                    aria-label={`Eliminar tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
                placeholder={tags.length === 0 ? 'Ej: f1, ferrari, carrera...' : tags.length >= MAX_TAGS ? `Máximo ${MAX_TAGS} tags` : 'Agregar tag...'}
                disabled={tags.length >= MAX_TAGS}
                className="flex-1 min-w-[120px] bg-transparent text-gray-200 text-sm outline-none placeholder:text-gray-500 disabled:opacity-50"
              />
            </div>
          </div>

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
