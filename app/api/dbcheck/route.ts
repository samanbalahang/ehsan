export async function GET() {
  return Response.json({
    userLen: process.env.DB_USER?.length,
    passLen: process.env.DB_PASSWORD?.length,
    host: process.env.DB_HOST,
    db: process.env.DB_NAME,
  });
}