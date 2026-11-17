import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '@/services/httpClient';

export type TelegramLinkMode = 'registration' | 'authenticated';

export interface UseTelegramLinkOptions {
  mode: TelegramLinkMode;
  onMessage?: (
    message: string | null,
    type: 'success' | 'error' | null,
  ) => void;
  onLinked?: (telegramUsername?: string) => void;
}

export interface TelegramFallbackProfile {
  telegram_username?: string | null;
  telegram_id?: string | null;
}

export function useTelegramLink({
  mode,
  onMessage,
  onLinked,
}: UseTelegramLinkOptions) {
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [telegramPending, setTelegramPending] = useState(false);
  const [telegramOtp, setTelegramOtp] = useState<string | null>(null);
  const [telegramUsername, setTelegramUsername] = useState<string>('');
  const [linkingTelegram, setLinkingTelegram] = useState(false);
  const [unlinkingTelegram, setUnlinkingTelegram] = useState(false);

  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  const onLinkedRef = useRef(onLinked);
  onLinkedRef.current = onLinked;

  const notify = useCallback(
    (msg: string | null, type: 'success' | 'error' | null) => {
      onMessageRef.current?.(msg, type);
    },
    [],
  );

  // Polling para verificar vinculación de Telegram en tiempo real
  useEffect(() => {
    if (!telegramPending) return;
    if (mode === 'registration' && !telegramOtp) return;

    const verifyEndpoint =
      mode === 'registration'
        ? `/telegram/verificar-registro/${telegramOtp}`
        : '/telegram/verificar';

    const interval = setInterval(async () => {
      try {
        const res = await apiClient.get<{
          vinculado: boolean;
          pendiente: boolean;
          telegram_username?: string;
          error?: string;
          expirado?: boolean;
        }>(verifyEndpoint);
        const data = res.data;

        if (data.vinculado) {
          setTelegramLinked(true);
          setTelegramPending(false);
          if (mode === 'authenticated') {
            setTelegramOtp(null);
          }
          if (data.telegram_username) {
            setTelegramUsername(data.telegram_username);
          }
          onLinkedRef.current?.(data.telegram_username);
          notify('¡Cuenta de Telegram vinculada con éxito!', 'success');
        } else if (data.error) {
          setTelegramPending(false);
          setTelegramOtp(null);
          notify(data.error, 'error');
        } else if (data.expirado) {
          setTelegramPending(false);
          setTelegramOtp(null);
          notify(
            'El código de Telegram expiró. Vuelve a intentarlo.',
            'error',
          );
        }
      } catch {
        // Silenciar errores de polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [mode, telegramPending, telegramOtp, notify]);

  const verifyInitialStatus = useCallback(
    async (fallback?: TelegramFallbackProfile) => {
      if (mode !== 'authenticated') return;

      if (fallback?.telegram_username) {
        setTelegramUsername(fallback.telegram_username);
      }

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
          setTelegramUsername(tgData.telegram_username);
        }
      } catch {
        if (fallback?.telegram_username) {
          setTelegramUsername(fallback.telegram_username);
          if (fallback.telegram_id !== undefined) {
            setTelegramLinked(
              Boolean(
                fallback.telegram_id && !fallback.telegram_id.includes('otp'),
              ),
            );
            setTelegramPending(Boolean(fallback.telegram_id?.includes('otp')));
            if (fallback.telegram_id?.includes('otp')) {
              setTelegramOtp(fallback.telegram_id);
            }
          }
        }
      }
    },
    [mode],
  );

  const handleLinkTelegram = useCallback(async () => {
    setLinkingTelegram(true);
    notify(null, null);

    // Abrir ventana inmediatamente en el evento click para evitar bloqueo de popups en Brave/Chrome
    const telegramWindow = window.open('about:blank', '_blank');

    const generateEndpoint =
      mode === 'registration'
        ? '/telegram/generarcodigo-registro'
        : '/telegram/generarcodigo';

    try {
      const res = await apiClient.post<{ codigo: string; message: string }>(
        generateEndpoint,
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
      if (mode === 'authenticated' && err.response?.status === 409) {
        setTelegramLinked(true);
        setTelegramPending(false);
        notify('Tu cuenta de Telegram ya está vinculada.', 'success');
      } else {
        console.error('Error al generar código de Telegram:', err);
        const defaultMsg =
          mode === 'registration'
            ? 'Error al iniciar vinculación con Telegram.'
            : 'Error al generar código de Telegram.';
        notify(err.response?.data?.message || defaultMsg, 'error');
      }
    } finally {
      setLinkingTelegram(false);
    }
  }, [mode, notify]);

  const handleCancelPending = useCallback(() => {
    setTelegramPending(false);
    setTelegramOtp(null);
  }, []);

  const resetTelegram = useCallback(() => {
    setTelegramLinked(false);
    setTelegramPending(false);
    setTelegramOtp(null);
    setTelegramUsername('');
  }, []);

  const handleUnlinkTelegram = useCallback(async () => {
    if (mode === 'registration') {
      resetTelegram();
      return;
    }

    setUnlinkingTelegram(true);
    notify(null, null);
    try {
      await apiClient.delete('/telegram/desvincular');
      resetTelegram();
      notify('Cuenta de Telegram desvinculada.', 'success');
    } catch (err: any) {
      notify(
        err.response?.data?.message || 'Error al desvincular Telegram.',
        'error',
      );
    } finally {
      setUnlinkingTelegram(false);
    }
  }, [mode, notify, resetTelegram]);

  return {
    telegramLinked,
    telegramPending,
    telegramOtp,
    telegramUsername,
    linkingTelegram,
    unlinkingTelegram,
    verifyInitialStatus,
    handleLinkTelegram,
    handleCancelPending,
    handleUnlinkTelegram,
    resetTelegram,
  };
}
