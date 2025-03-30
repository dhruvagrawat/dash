'use client';

import { useState } from 'react';

export function SteelSessionViewer() {
    const [sessionData, setSessionData] = useState<{
        url: string | null;
        id: string | null;
    }>({ url: null, id: null });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createSession = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/steel-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create session');
            }

            const data = await res.json();
            setSessionData({
                url: data.sessionViewerUrl,
                id: data.sessionId
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create session');
            console.error('Error creating Steel session:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const releaseSession = async () => {
        if (!sessionData.id) return;

        try {
            await fetch('/api/steel-session', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId: sessionData.id }),
            });
            setSessionData({ url: null, id: null });
        } catch (err) {
            console.error('Error releasing session:', err);
        }
    };

    return (
        <div className="steel-session-container">
            <div className="button-group">
                <button
                    onClick={createSession}
                    disabled={isLoading}
                    className={`session-button ${isLoading ? 'loading' : ''}`}
                >
                    {isLoading ? 'Creating Session...' : 'Start Steel Session'}
                </button>

                {sessionData.url && (
                    <button
                        onClick={releaseSession}
                        className="session-button danger"
                    >
                        End Session
                    </button>
                )}
            </div>

            {error && (
                <div className="error-message">
                    Error: {error}
                </div>
            )}

            {sessionData.url && (
                <div className="session-frame-container">
                    <iframe
                        src={sessionData.url}
                        width="100%"
                        height="600px"
                        frameBorder="0"
                        allow="fullscreen accelerometer; gyroscope"
                        title="Steel Session Viewer"
                        className="session-iframe"
                    />
                </div>
            )}
        </div>
    );
}