
export async function register() {
  console.log('-----------------------------------------');
  console.log('[SERVER] Starting up...');
  console.log('[SERVER] Environment: ' + process.env.NODE_ENV);

  try {
    // Dynamic import to avoid build-time execution issues
    const { query } = await import('@/lib/db');
    const { redis } = await import('@/lib/redis');

    // Check DB
    await query('SELECT 1');
    console.log('[SERVER] Database connection validated');

    // Check Redis
    await redis.ping();
    console.log('[SERVER] Redis connection validated');
    
    console.log('[SERVER] Ready to serve requests');
  } catch (error) {
    console.error('[SERVER] Startup Check Failed:', error);
  }
  console.log('-----------------------------------------');
}
