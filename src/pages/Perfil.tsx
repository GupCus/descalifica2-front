import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Pencil,
  ArrowLeft,
  Trophy,
  Flag,
  MapPin,
  CheckCircle,
  Link as LinkIcon,
  Loader2,
  Send,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthService } from '@/services/auth.service.ts';
import { apiClient } from '@/services/httpClient';
import { getAssetUrl } from '@/utils/asset.util.ts';
import fondoPerfil from '../assets/garageRB.jpg';

interface ProfileData {
  id: number;
  name: string;
  surname: string | null;
  username: string;
  email: string;
  date_of_birth: string | null;
  fav_driver: string | null;
  fav_team: string | null;
  fav_circuit: string | null;
  bio: string | null;
  telegram_username: string | null;
  telegram_id?: string | null;
  avatar_url?: string | null;
  avatar?: string | null;
  user_type?: string;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function Perfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de Telegram
  const [telegram, setTelegram] = useState('');
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [telegramPending, setTelegramPending] = useState(false);
  const [telegramOtp, setTelegramOtp] = useState<string | null>(null);
  const [linkingTelegram, setLinkingTelegram] = useState(false);
  const [telegramMessage, setTelegramMessage] = useState<string | null>(null);
  const [telegramMessageType, setTelegramMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await AuthService.getCurrentUser();
        if (!me) {
          navigate('/login');
          return;
        }
        setUserRole(me.user_type || 'user');

        if (me.avatar) {
          setAvatarUrl(getAssetUrl(me.avatar));
        }

        const response = await apiClient.get<{ data: ProfileData }>(
          `/usuarios/${me.id}`,
        );
        const data = response.data.data;
        setProfile(data);

        const avatarPath = data.avatar || data.avatar_url || me.avatar;
        if (avatarPath) {
          setAvatarUrl(getAssetUrl(avatarPath));
        } else if (!me.avatar) {
          setAvatarUrl('');
        }

        // Verificar estado de vinculación de Telegram
        try {
          const tgRes = await apiClient.get<{
            vinculado: boolean;
            pendiente: boolean;
            telegram_username?: string;
          }>('/telegram/verificar');
          const tgData = tgRes.data;
          setTelegramLinked(tgData.vinculado);
          setTelegramPending(tgData.pendiente);
          if (tgData.telegram_username) {
            setTelegram(tgData.telegram_username);
          } else if (data.telegram_username) {
            setTelegram(data.telegram_username);
          }
        } catch {
          if (data.telegram_username) {
            setTelegram(data.telegram_username);
            setTelegramLinked(Boolean(data.telegram_id && !data.telegram_id.includes('otp')));
            setTelegramPending(Boolean(data.telegram_id?.includes('otp')));
            if (data.telegram_id?.includes('otp')) {
              setTelegramOtp(data.telegram_id);
            }
          }
        }
      } catch (err: any) {
        console.error('Error al cargar perfil:', err);
        setError('Error al cargar los datos del perfil.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // Polling: cuando está pendiente de vinculación, verificar cada 3 segundos
  useEffect(() => {
    if (!telegramPending) return;

    const interval = setInterval(async () => {
      try {
        const tgRes = await apiClient.get<{
          vinculado: boolean;
          pendiente: boolean;
          telegram_username?: string;
        }>('/telegram/verificar');
        const tgData = tgRes.data;
        if (tgData.vinculado) {
          setTelegramLinked(true);
          setTelegramPending(false);
          setTelegramOtp(null);
          if (tgData.telegram_username) {
            setTelegram(tgData.telegram_username);
            setProfile((prev) => prev ? { ...prev, telegram_username: tgData.telegram_username! } : prev);
          }
          setTelegramMessageType('success');
          setTelegramMessage('¡Cuenta de Telegram vinculada con éxito!');
        }
      } catch {
        // Silenciar errores de polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [telegramPending]);

  const handleLinkTelegram = async () => {
    setLinkingTelegram(true);
    setTelegramMessage(null);
    setTelegramMessageType(null);

    // Abrir ventana inmediatamente en el evento click para evitar bloqueo de popups
    const telegramWindow = window.open('about:blank', '_blank');

    try {
      const res = await apiClient.post<{ codigo: string; message: string }>(
        '/telegram/generarcodigo',
      );
      const codigo = res.data.codigo;
      setTelegramOtp(codigo);
      setTelegramPending(true);

      const targetUrl = `https://t.me/descalifica2bot?start=${codigo}`;
      if (telegramWindow && !telegramWindow.closed) {
        telegramWindow.location.href = targetUrl;
      } else {
        window.open(targetUrl, '_blank');
      }
    } catch (err: any) {
      if (telegramWindow && !telegramWindow.closed) {
        telegramWindow.close();
      }
      if (err.response?.status === 409) {
        setTelegramMessageType('success');
        setTelegramMessage('Tu cuenta de Telegram ya está vinculada.');
        setTelegramLinked(true);
        setTelegramPending(false);
      } else {
        console.error('Error al generar código de Telegram:', err);
        setTelegramMessageType('error');
        setTelegramMessage(
          err.response?.data?.message || 'Error al generar código de Telegram.',
        );
      }
    } finally {
      setLinkingTelegram(false);
    }
  };

  const handleCancelTelegramPending = () => {
    setTelegramPending(false);
    setTelegramOtp(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400 text-lg">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-4">
        <p className="text-red-400 text-lg">
          {error || 'No se pudo encontrar el usuario.'}
        </p>
        <Link
          to="/"
          className="text-gray-300 hover:text-white bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const isAdmin = userRole === 'admin' || profile.user_type === 'admin';
  const formattedBirthDate = formatDate(profile.date_of_birth);

  return (
    <div className="relative min-h-screen py-4 sm:py-8 flex flex-col justify-start">
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${fondoPerfil})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(6px) brightness(0.35)',
        }}
      />

      <div className="relative z-10 max-w-xl w-full mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-all bg-gray-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700/60 hover:border-gray-500 text-xs sm:text-sm"
          >
            <ArrowLeft size={14} />
            Volver al inicio
          </Link>
          {isAdmin && (
            <Link
              to="/menuadmin"
              className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-all bg-red-950/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-red-800/60 hover:border-red-600 text-xs sm:text-sm"
            >
              <Shield size={14} />
              Panel Admin
            </Link>
          )}
        </div>

        <div className="bg-gray-950/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/60 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-700/60 pb-3 mb-3.5">
            <h1
              className="text-gray-200 text-lg sm:text-2xl font-bold tracking-wider uppercase"
              style={{
                fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
                letterSpacing: '0.08em',
              }}
            >
              Mi Perfil
            </h1>
            <Button
              onClick={() => navigate('/perfil/editar')}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 px-3 py-1.5 h-8 rounded-lg text-xs font-medium cursor-pointer shadow-md"
            >
              <Pencil size={13} />
              <span>Editar</span>
            </Button>
          </div>

          <div className="flex flex-col items-center mb-4">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-blue-500/60 shadow-lg shadow-blue-950/40">
              {avatarUrl && (
                <AvatarImage
                  src={avatarUrl}
                  alt={profile.username}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gray-900 text-gray-400">
                {(profile.name || profile.username || 'U')
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-base sm:text-lg font-bold text-white mt-2 text-center">
              @{profile.username}
            </h2>
            {isAdmin && (
              <Badge
                variant="destructive"
                className="mt-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30"
              >
                Admin
              </Badge>
            )}
          </div>

          <div className="space-y-3.5 border-t border-gray-700/60 pt-3.5">
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Información Personal
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                <div className="p-2 sm:p-2.5 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/40">
                  <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-semibold tracking-wider block">
                    Nombre
                  </span>
                  <span className="text-xs sm:text-sm text-gray-200 font-medium truncate block mt-0.5">
                    {profile.name || '—'}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/40">
                  <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-semibold tracking-wider block">
                    Apellido
                  </span>
                  <span className="text-xs sm:text-sm text-gray-200 font-medium truncate block mt-0.5">
                    {profile.surname || '—'}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/40 col-span-2">
                  <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-semibold tracking-wider block">
                    Correo Electrónico
                  </span>
                  <span className="text-xs sm:text-sm text-gray-200 font-medium truncate block mt-0.5">
                    {profile.email}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/40">
                  <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-semibold tracking-wider block">
                    Nacimiento
                  </span>
                  <span className="text-xs sm:text-sm text-gray-200 font-medium truncate block mt-0.5">
                    {formattedBirthDate || (
                      <span className="text-gray-500 italic text-[11px]">
                        No especificada
                      </span>
                    )}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/40">
                  <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1 mb-1.5">
                    <Send size={11} className="text-blue-400" />
                    Telegram
                  </span>

                  {/* Estado: Vinculado */}
                  {telegramLinked && (
                    <div className="flex items-center gap-2 h-9 px-2.5 bg-green-950/40 border border-green-700/50 rounded-md">
                      <CheckCircle size={14} className="text-green-400 shrink-0" />
                      <span className="text-xs sm:text-sm text-green-300 font-medium truncate">
                        @{telegram || profile.telegram_username}
                      </span>
                    </div>
                  )}

                  {/* Estado: Pendiente de vinculación */}
                  {telegramPending && !telegramLinked && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between h-9 px-2.5 bg-amber-950/40 border border-amber-700/50 rounded-md">
                        <div className="flex items-center gap-2 truncate">
                          <Loader2 size={14} className="text-amber-400 animate-spin shrink-0" />
                          <span className="text-[11px] text-amber-300 font-medium truncate">
                            Esperando vinculación...
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCancelTelegramPending}
                          className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 cursor-pointer shrink-0 ml-2"
                          title="Cancelar vinculación"
                        >
                          <X size={12} />
                          Cancelar
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            `https://t.me/descalifica2bot?start=${telegramOtp || profile.telegram_id}`,
                            '_blank',
                          )
                        }
                        className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer underline block text-left"
                      >
                        ¿No se abrió? Hacé clic acá para ir al bot
                      </button>
                    </div>
                  )}

                  {/* Estado: No vinculado */}
                  {!telegramLinked && !telegramPending && (
                    <Button
                      type="button"
                      onClick={handleLinkTelegram}
                      disabled={linkingTelegram}
                      className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white border-0 text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {linkingTelegram ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Generando código...
                        </>
                      ) : (
                        <>
                          <LinkIcon size={13} />
                          Vincular cuenta de Telegram
                        </>
                      )}
                    </Button>
                  )}

                  {telegramMessage && (
                    <p
                      className={`text-[10px] mt-1.5 ${
                        telegramMessageType === 'error'
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}
                    >
                      {telegramMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Preferencias de Automovilismo
              </h3>
              <div className="space-y-1.5">
                <div className="p-2 sm:p-2.5 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/40 flex items-center justify-between gap-2 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="p-1 bg-amber-500/10 text-amber-400 rounded-md">
                      <Trophy size={13} />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Piloto Favorito
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200 text-right truncate">
                    {profile.fav_driver || (
                      <span className="text-gray-500 font-normal italic text-xs">
                        No especificado
                      </span>
                    )}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/40 flex items-center justify-between gap-2 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="p-1 bg-red-500/10 text-red-400 rounded-md">
                      <Flag size={13} />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Escudería Favorita
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200 text-right truncate">
                    {profile.fav_team || (
                      <span className="text-gray-500 font-normal italic text-xs">
                        No especificada
                      </span>
                    )}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/40 flex items-center justify-between gap-2 hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="p-1 bg-emerald-500/10 text-emerald-400 rounded-md">
                      <MapPin size={13} />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Circuito Favorito
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200 text-right truncate">
                    {profile.fav_circuit || (
                      <span className="text-gray-500 font-normal italic text-xs">
                        No especificado
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div>
                <h3 className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Sobre mí
                </h3>
                <div className="p-2 sm:p-2.5 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/40">
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
