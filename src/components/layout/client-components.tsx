'use client';

import dynamic from 'next/dynamic';

// The shopping assistant chat is a client component that uses hooks,
// so we load it dynamically to avoid it being part of the server-side render.
export const DynamicShoppingAssistantChat = dynamic(
  () => import('@/components/shopping-assistant-chat'),
  { ssr: false }
);
