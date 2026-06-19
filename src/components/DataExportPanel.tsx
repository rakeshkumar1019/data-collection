import { useState, useEffect } from 'react';
import { getAllSubmissions, exportDataAsCSV, clearAllSubmissions, checkServerHealth } from '../services/api';
import './DataExportPanel.css';

export const DataExportPanel = () => {
  const [dataCount, setDataCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    try {
      setError('');
      await exportDataAsCSV();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to export CSV';
      setError(message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSubmissions();
      setDataCount(data.length);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
      try {
        setError('');
        await clearAllSubmissions();
        setDataCount(0);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to clear data';
        setError(message);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // Check server health and initial load
  useEffect(() => {
    const initializeData = async () => {
      const isHealthy = await checkServerHealth();
      setServerConnected(isHealthy);
      
      if (isHealthy) {
        await handleRefresh();
      } else {
        setError('Server is not connected. Make sure to run "npm run server" in another terminal.');
      }
    };

    initializeData();
  }, []);

  return (
    <div className="export-panel">
      <div className="panel-header">
        <h3>Data Management</h3>
        {!serverConnected && (
          <div className="connection-status offline">
            ⚠ Server Offline
          </div>
        )}
        {serverConnected && (
          <div className="connection-status online">
            ✓ Connected
          </div>
        )}
      </div>

      <div className="data-stats">
        <div className="stat-item">
          <span className="stat-label">Entries Stored:</span>
          <span className="stat-value">{dataCount}</span>
        </div>
      </div>

      <div className="button-group">
        <button
          onClick={handleRefresh}
          className="btn btn-secondary"
          disabled={!serverConnected || isLoading}
          title="Refresh the entry count"
        >
          {isLoading ? 'Loading...' : 'Refresh Count'}
        </button>

        <button
          onClick={handleExport}
          className="btn btn-primary"
          disabled={!serverConnected || dataCount === 0}
          title="Download all entries as CSV"
        >
          Export to CSV
        </button>

        <button
          onClick={handleClearData}
          className="btn btn-danger"
          disabled={!serverConnected || dataCount === 0}
          title="Clear all stored data"
        >
          Clear Data
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="panel-info">
        <p>All form submissions are saved to the server. Make sure the backend server is running.</p>
      </div>
    </div>
  );
};
