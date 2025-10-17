
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';

export default function AudioPlayer({ audioDataUri }: { audioDataUri: string | null }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // If src is not set, set it and then play
            if (!audioRef.current.src && audioDataUri) {
                audioRef.current.src = audioDataUri;
                setIsLoading(true);
                audioRef.current.play().catch(e => console.error("Audio play failed", e));
            } else {
                 audioRef.current.play().catch(e => console.error("Audio play failed", e));
            }
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
    };

    if (!audioDataUri) return null;

    return (
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg border">
            <audio
                ref={audioRef}
                onPlay={() => {
                    setIsPlaying(true);
                    setIsLoading(false);
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onCanPlay={() => setIsLoading(false)}
                preload="none"
            />
            <Button onClick={togglePlayPause} size="icon" variant="ghost" className="rounded-full">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button onClick={toggleMute} size="icon" variant="ghost" className="rounded-full">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <span className="text-sm font-medium mr-2">{isPlaying ? "Reproduciendo" : "Escuchar Resumen"}</span>
        </div>
    );
}
