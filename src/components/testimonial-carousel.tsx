
'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import testimonials from '@/lib/testimonials.json';
import { Star, User } from 'lucide-react';

export default function TestimonialCarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full max-w-4xl mx-auto"
    >
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1 h-full">
              <Card className="h-full flex flex-col justify-between">
                <CardContent className="p-6 text-left space-y-4">
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                       <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="font-body italic text-muted-foreground">
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>
                </CardContent>
                <div className="flex items-center gap-4 px-6 pb-6 border-t pt-4 bg-muted/50 rounded-b-lg">
                    <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.handle}</p>
                    </div>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious type="button" className="hidden sm:flex" />
      <CarouselNext type="button" className="hidden sm:flex" />
    </Carousel>
  );
}
