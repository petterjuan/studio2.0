'use client';

import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps extends ButtonProps {
  loadingText?: string;
  isClientLoading?: boolean;
}

export function SubmitButton({
  children,
  loadingText = "Cargando...",
  isClientLoading = false,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = pending || isClientLoading;

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
