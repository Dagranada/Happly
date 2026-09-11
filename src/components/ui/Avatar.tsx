import React from 'react';
import { UserRound } from 'lucide-react';

interface AvatarProps {
  /** URL de la foto; sin ella se muestra el vector predeterminado. */
  src?: string | null;
  alt?: string;
  className?: string;
}

/** Foto de perfil circular. Por defecto: silueta `UserRound` en brand sobre brand-100. */
export const Avatar: React.FC<AvatarProps> = ({ src, alt = '', className = 'w-10 h-10' }) => (
  <div
    className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-brand-100 text-brand ${className}`}
  >
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
    ) : (
      <UserRound className="w-[55%] h-[55%] stroke-[2]" aria-hidden="true" />
    )}
  </div>
);
