
import { NextResponse } from 'next/server';
import { generateAndSaveBlogArticle } from '@/ai/flows/blog-generator';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // If the CRON_SECRET is configured, we must enforce the check.
  // Otherwise, for local development or if the secret is not set, we bypass it.
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    console.log('Cron job started: Generating new blog article...');
    await generateAndSaveBlogArticle();
    console.log('Cron job finished successfully.');
    return NextResponse.json({ success: true, message: 'Blog article generated successfully.' });
  } catch (error) {
    console.error('Cron job failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
