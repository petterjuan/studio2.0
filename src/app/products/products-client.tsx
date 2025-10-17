
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// This client component wraps the static content and provides client-side interactivity
// for the "like" button, which was previously handled in the main page component.
export function ProductsClient({ children }: { children: React.ReactNode }) {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast({
        title: '¡Gracias por tu apoyo!',
        description: 'Nos alegra que te guste nuestra misión.',
      });
    }
  };
  
  // Replace the static heart with the interactive one
  const childrenWithInteractiveHeart = React.Children.map(children, child => {
    if (React.isValidElement(child) && (child as any).props.className?.includes('text-center')) {
        const grandChildren = (child as any).props.children;
        const newGrandChildren = React.Children.map(grandChildren, grandChild => {
            if (React.isValidElement(grandChild) && grandChild.type === motion.div) {
                 return (
                    <motion.div
                        key="like-button"
                        whileTap={{ scale: 1.5 }}
                        className="inline-block cursor-pointer"
                        onClick={handleLikeClick}
                    >
                        <Heart className={cn("mx-auto h-12 w-12 text-primary transition-colors", isLiked && "fill-primary")} />
                    </motion.div>
                 )
            }
            return grandChild;
        });
        return React.cloneElement(child as React.ReactElement, { children: newGrandChildren });
    }
    return child;
  });

  return <>{childrenWithInteractiveHeart}</>;
}
