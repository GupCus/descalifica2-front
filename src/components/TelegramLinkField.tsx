import { CheckCircle, Link as LinkIcon, Loader2, Unlink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TelegramLinkFieldProps {
  telegramLinked: boolean;
  telegramPending: boolean;
  telegramUsername?: string | null;
  telegramOtp?: string | null;
  linkingTelegram: boolean;
  unlinkingTelegram?: boolean;
  allowUnlink?: boolean;
  onLink: () => void;
  onCancelPending: () => void;
  onUnlink?: () => void;
}

export function TelegramLinkField({
  telegramLinked,
  telegramPending,
  telegramUsername,
  telegramOtp,
  linkingTelegram,
  unlinkingTelegram = false,
  allowUnlink = true,
  onLink,
  onCancelPending,
  onUnlink,
}: TelegramLinkFieldProps) {
  if (telegramLinked) {
    return (
      <div className="flex items-center gap-2 h-9 px-2.5 bg-green-950/40 border border-green-700/50 rounded-md">
        <CheckCircle size={14} className="text-green-400 shrink-0" />
        <span className="text-xs sm:text-sm text-green-300 font-medium truncate">
          {telegramUsername ? `@${telegramUsername}` : 'Cuenta vinculada'}
        </span>
        {allowUnlink && onUnlink && (
          <button
            type="button"
            onClick={onUnlink}
            disabled={unlinkingTelegram}
            className="ml-auto text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Unlink size={10} />
            {unlinkingTelegram ? '...' : 'Desvincular'}
          </button>
        )}
      </div>
    );
  }

  if (telegramPending) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between h-9 px-2.5 bg-amber-950/40 border border-amber-700/50 rounded-md">
          <div className="flex items-center gap-2 truncate">
            <Loader2
              size={14}
              className="text-amber-400 animate-spin shrink-0"
            />
            <span className="text-[11px] text-amber-300 font-medium truncate">
              Esperando vinculación...
            </span>
          </div>
          <button
            type="button"
            onClick={onCancelPending}
            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 cursor-pointer shrink-0 ml-2"
            title="Cancelar vinculación"
          >
            <X size={12} />
            Cancelar
          </button>
        </div>
        {telegramOtp && (
          <button
            type="button"
            onClick={() =>
              window.open(
                `https://t.me/descalifica2bot?start=${telegramOtp}`,
                '_blank',
              )
            }
            className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer underline block text-left"
          >
            ¿No se abrió? Hacé clic acá para ir al bot
          </button>
        )}
      </div>
    );
  }

  return (
    <Button
      type="button"
      onClick={onLink}
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
  );
}
