import {NextRequest, NextResponse} from 'next/server';
import {shoppingAssistantFlow} from '@/ai/flows/shopping-assistant';
import { ShoppingAssistantInput } from '@/lib/definitions';

export async function POST(req: NextRequest) {
  try {
    const {query, history} = (await req.json()) as ShoppingAssistantInput;

    if (!query) {
      return NextResponse.json(
        {error: 'Query is required.'},
        {status: 400}
      );
    }

    const result = await shoppingAssistantFlow({query, history});

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API Workout Plan] Error:', error);
    return NextResponse.json(
      {error: 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}
