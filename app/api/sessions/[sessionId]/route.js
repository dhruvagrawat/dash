export async function DELETE(request, { params }) {
    const apiKey = process.env.ANCHOR_API_KEY;
    const { sessionId } = params;

    try {
        const response = await fetch(`https://api.anchorbrowser.io/v1/sessions/${sessionId}`, {
            method: 'DELETE',
            headers: {
                'anchor-api-key': apiKey
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Session deleted'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Session Deletion Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}