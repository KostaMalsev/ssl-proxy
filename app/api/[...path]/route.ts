export async function GET() {
  return new Response(JSON.stringify({ message: "It works!" }), {
    headers: { "Content-Type": "application/json" },
  });
}
