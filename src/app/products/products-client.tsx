
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export function ProductsClient({ children }: { children: React.ReactNode }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };
  
  const childrenWithInteractiveHeart = React.Children.map(children, child => {
    if (React.isValidElement(child) && (child as any).props.className?.includes('text-center')) {
        const grandChildren = (child as any).props.children;
        const newGrandChildren = React.Children.map(grandChildren, grandChild => {
            if (React.isValidElement(grandChild) && grandChild.type === motion.div) {
                 return (
                    <TooltipProvider key="like-tooltip">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.div
                                    whileTap={{ scale: 1.5 }}
                                    className="inline-block cursor-pointer"
                                    onClick={handleLikeClick}
                                >
                                    <Heart className={cn("mx-auto h-12 w-12 text-primary transition-all duration-300", isLiked && "fill-primary")} />
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isLiked ? "¡Gracias por tu apoyo!" : "Apoya nuestra misión"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
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

    