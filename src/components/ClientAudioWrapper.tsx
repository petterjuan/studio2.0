'use client';

import dynamic from 'next/dynamic';

// This component acts as a client-side wrapper that dynamically imports the AudioPlayer.
// By setting ssr: false, we ensure it only renders on the client, preventing hydration errors.
const AudioPlayer = dynamic(() => import('../app/blog/[slug]/audio-player'), { ssr: false });

export default AudioPlayer;
