// app/api/tools/perform-web-task/route.js
export async function POST(request) {
    const apiKey = process.env.ANCHOR_API_KEY;
    const { searchParams } = new URL(request.url);

    try {
        const payload = await request.json();
        const sessionId = searchParams.get('sessionId');

        const response = await fetch('https://api.anchorbrowser.io/v1/tools/perform-web-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anchor-api-key': apiKey
            },
            body: JSON.stringify({
                ...payload,
                sessionId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Full API Error Response:', data);
            throw new Error(data.error?.message || JSON.stringify(data));
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Server Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}