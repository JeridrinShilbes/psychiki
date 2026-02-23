import { useState } from 'react';
import './index.css';

function App() {
  const [endpoint, setEndpoint] = useState('/api/health');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const serverUrl = import.meta.env.RENDER_SERVER_URL || 'http://localhost:3000';

  const handleTestConnection = async () => {
    setLoading(true);
    setStatus('pending');
    setResponse(null);

    try {
      // Clean up slashes
      const baseURL = serverUrl.replace(/\/$/, '');
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${baseURL}${path}`;

      const startTime = performance.now();
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await res.text();
      const endTime = performance.now();

      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        parsedData = data;
      }

      setResponse(JSON.stringify({
        status: res.status,
        statusText: res.statusText,
        latency: `${Math.round(endTime - startTime)}ms`,
        body: parsedData
      }, null, 2));

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error: any) {
      setStatus('error');
      setResponse(JSON.stringify({
        error: error.message || 'Failed to connect to server',
        suggestion: 'Check if the backend is running and CORS is enabled.'
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="hero-section">
        <h1 className="hero-title">Nexus Connection</h1>
        <p className="hero-subtitle">
          Real-time interface connecting to your robust Render backend architecture.
        </p>
      </header>

      <main className="glass-card">
        <div className="form-group">
          <label className="input-label">Backend Server URL</label>
          <input
            type="text"
            className="styled-input"
            value={serverUrl}
            disabled
            title="Sourced from RENDER_SERVER_URL environment variable"
          />
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="input-label">API Endpoint Path</label>
          <input
            type="text"
            className="styled-input"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/api/status"
          />
        </div>

        <div className="button-group">
          <button
            className="primary-btn"
            onClick={handleTestConnection}
            disabled={loading}
          >
            {loading ? (
              <><span className="loader"></span> Connecting...</>
            ) : (
              <>Initiate Connection</>
            )}
          </button>
        </div>

        {(response || status !== 'pending') && (
          <div style={{ marginTop: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
            <div className={`status-indicator status-${status}`}>
              <div className="status-dot"></div>
              <span>
                {status === 'success' ? 'Connection Established' :
                  status === 'error' ? 'Connection Failed' : 'Ready'}
              </span>
            </div>

            <pre className="response-area">
              {response || 'Awaiting response data...'}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
