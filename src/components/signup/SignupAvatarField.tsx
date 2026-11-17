import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';

export interface SignupAvatarFieldProps {
  avatar: File | null;
  previewUrl: string | null;
  googleAvatar: string | null;
  useCustomAvatar: boolean;
  onSelectAvatar: (file: File) => void;
  onRemoveAvatar: () => void;
  onSetUseCustomAvatar: (useCustom: boolean) => void;
}

export function SignupAvatarField({
  avatar,
  previewUrl,
  googleAvatar,
  useCustomAvatar,
  onSelectAvatar,
  onRemoveAvatar,
  onSetUseCustomAvatar,
}: SignupAvatarFieldProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onSelectAvatar(acceptedFiles[0]);
      }
    },
    [onSelectAvatar],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  return (
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
            onClick={() => onSetUseCustomAvatar(true)}
            className="text-xs h-8 shrink-0 cursor-pointer"
          >
            Cambiar foto
          </Button>
        </div>
      ) : !avatar ? (
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
                  onRemoveAvatar();
                  onSetUseCustomAvatar(false);
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
                {avatar.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(avatar.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onRemoveAvatar();
                if (googleAvatar) {
                  onSetUseCustomAvatar(false);
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
  );
}
