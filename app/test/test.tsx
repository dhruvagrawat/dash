'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const JOB_PLATFORMS = {
    linkedin: {
        label: 'Apply on LinkedIn',
        url: 'https://www.linkedin.com/jobs',
        prompt: 'Automatically apply to relevant software engineering jobs'
    }
};

// Session timeout in milliseconds (5 minutes)
const SESSION_TIMEOUT = 5 * 60 * 1000;

export default function JobApplicationSystem() {
    interface Session {
        id: string;
        liveView: string;
    }

    const [session, setSession] = useState<Session | null>(null);
    const [logs, setLogs] = useState<{ timestamp: string; message: string }[]>([]);
    const [isCreatingSession, setIsCreatingSession] = useState(false);
    const [isRunningTask, setIsRunningTask] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    // Strict 3-step process
    const startApplicationProcess = async () => {
        // 1. Create Browser Session
        setIsCreatingSession(true);
        setLogs([]);
        setIframeLoaded(false);

        try {
            // Phase 1: Session Creation
            addLog('Starting browser session creation...');
            const sessionResponse = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timeout: SESSION_TIMEOUT // Set session timeout to 5 minutes
                })
            });

            if (!sessionResponse.ok) {
                const error = await sessionResponse.json();
                throw new Error(error.message || 'Session creation failed');
            }

            const sessionData = await sessionResponse.json();
            addLog('Browser session created successfully ✅');

            // Immediately update session state
            setSession({
                id: sessionData.data.id,
                liveView: sessionData.data.live_view_url
            });

            setIsCreatingSession(false);

            // We'll start the task after iframe is loaded in the useEffect below
            addLog('Waiting for browser to fully load before starting job applications...');

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
            addLog(`Error: ${error.message} ❌`);
            setSession(null);
            setIsCreatingSession(false);
        }
    };

    // Start job application process only after iframe is fully loaded
    useEffect(() => {
        const runJobApplication = async () => {
            if (session && iframeLoaded && !isRunningTask) {
                setIsRunningTask(true);
                addLog('Browser fully loaded. Starting job application process...');

                try {
                    const taskResponse = await fetch(`/api/tools/perform-web-task?sessionId=${session.id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...JOB_PLATFORMS.linkedin,
                            sessionId: session.id
                        })
                    });

                    if (!taskResponse.ok) {
                        const error = await taskResponse.json();
                        throw new Error(error.message || 'Application failed');
                    }

                    const taskData = await taskResponse.json();
                    addLog('Application process completed successfully 🎉');
                } catch (error) {
                    toast.error(error.message);
                    addLog(`Error: ${error.message} ❌`);
                } finally {
                    setIsRunningTask(false);
                }
            }
        };

        runJobApplication();
    }, [session, iframeLoaded]);

    const terminateSession = async () => {
        if (!session) return;

        try {
            addLog('Terminating browser session...');
            const response = await fetch(`/api/sessions/${session.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to terminate session');
            }

            addLog('Browser session terminated successfully ✅');
            setSession(null);
            setIframeLoaded(false);
        } catch (error) {
            toast.error(error.message);
            addLog(`Error terminating session: ${error.message} ❌`);
        }
    };

    const addLog = (message: string) => {
        setLogs(prev => [...prev, {
            timestamp: new Date().toISOString(),
            message
        }]);
    };

    const handleIframeLoad = () => {
        addLog('Browser session fully loaded ✅');
        setIframeLoaded(true);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            {/* Control Section */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="flex space-x-4">
                    <button
                        onClick={startApplicationProcess}
                        disabled={isCreatingSession || isRunningTask || session !== null}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isCreatingSession && 'Starting Browser...'}
                        {isRunningTask && 'Applying to Jobs...'}
                        {!isCreatingSession && !isRunningTask && !session && 'Start LinkedIn Application'}
                        {!isCreatingSession && !isRunningTask && session && 'Session Active'}
                    </button>

                    {session && iframeLoaded && (
                        <button
                            onClick={terminateSession}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all"
                        >
                            Terminate Session
                        </button>
                    )}
                </div>
            </div>

            {/* Session Browser */}
            {session?.liveView && (
                <div className="bg-white p-4 rounded-lg shadow-xl">
                    <h2 className="text-xl font-semibold mb-4">Live Browser Session</h2>
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <iframe
                            src={session.liveView}
                            className="w-full h-[700px] border-0"
                            title="Live Application Browser"
                            onLoad={handleIframeLoad}
                        />
                        <div className="absolute top-2 right-2 bg-black/80 text-white px-3 py-1 rounded text-sm">
                            Session ID: {session.id}
                        </div>
                    </div>
                </div>
            )}

            {/* Process Logs */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <h3 className="text-lg font-semibold mb-4">System Logs</h3>
                <div className="space-y-2 h-64 overflow-y-auto font-mono text-sm">
                    {logs.map((log, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 mr-2">
                                {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            {log.message}
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="text-gray-500 text-center py-4">
                            No logs yet. Start the process to see activity...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}