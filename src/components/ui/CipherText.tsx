'use client';
import { useCipherText } from '@/hooks/useCipherText';

interface Props {
  children: string;
  className?: string;
  onClick?: () => void;
}

export function CipherText({ children, className = '', onClick }: Props) {
  const { text, scramble } = useCipherText(children);

  return (
    <span
      onMouseEnter={scramble}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      {text}
    </span>
  );
}
