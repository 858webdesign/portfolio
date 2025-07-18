export async function GET() {
  const res = await fetch('https://backend.petereichhorst.com/wp-json/custom/v1/footer-blocks');

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch footer blocks' }), { status: 500 });
  }

  const json = await res.json();

  return Response.json({
    blocks: json.blocks || [],
  });
}
