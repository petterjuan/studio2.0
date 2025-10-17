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


export function ProductsClient() {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };
  
  return (
      <TooltipProvider>
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
