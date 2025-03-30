export async function POST() {
    const apiKey = process.env.ANCHOR_API_KEY;

    try {
        const response = await fetch('https://api.anchorbrowser.io/v1/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anchor-api-key': apiKey
            },
            body: JSON.stringify({
                session: {
                    timeout: { max_duration: 2, idle_timeout: 1 },
                    live_view: { read_only: false }
                },
                browser: {
                    profile: { name: "job-apps", persist: true },
                    headless: { active: false },
                    viewport: { width: 1440, height: 900 }
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Session Creation Error:', error);
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