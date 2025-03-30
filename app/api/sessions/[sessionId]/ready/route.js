// app/api/sessions/[sessionId]/ready/route.js
export async function GET(request, { params }) {
    const apiKey = process.env.ANCHOR_API_KEY;
    const { sessionId } = params;

    try {
        const response = await fetch(`https://api.anchorbrowser.io/v1/sessions/${sessionId}`, {
            headers: {
                'anchor-api-key': apiKey
            }
        });

        return new Response(JSON.stringify({
            ready: response.ok
        }), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            ready: false,
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}