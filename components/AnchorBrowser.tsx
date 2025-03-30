// components/AnchorBrowser.tsx
'use client';
import { useState } from 'react';

export default function AnchorBrowser() {
    const [session, setSession] = useState<{ id: string; wsEndpoint: string } | null>(null);
    const [task, setTask] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const createSession = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/anchor/create-session');
            const data = await res.json();
            setSession(data);
        } finally {
            setLoading(false);
        }
    };

    const runTask = async () => {
        if (!session || !task) return;

        setLoading(true);
        try {
            const res = await fetch('/api/anchor/automate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wsEndpoint: session.wsEndpoint,
                    task
                })
            });

            const data = await res.json();
            setResult(data.result);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="anchor-container">
            {!session && (
                <button
                    onClick={createSession}
                    disabled={loading}
                >
                    {loading ? 'Starting Session...' : 'Start Browser Session'}
                </button>
            )}

            {session && (
                <div className="session-interface">
                    <textarea
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Enter AI instruction (e.g. 'Fill the form as Michael Scott...')"
                    />

                    <button onClick={runTask} disabled={loading}>
                        {loading ? 'Executing...' : 'Run Task'}
                    </button>

                    {result && (
                        <div className="result-output">
                            <h4>AI Result:</h4>
                            <pre>{result}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}