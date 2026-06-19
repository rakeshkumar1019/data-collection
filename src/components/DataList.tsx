import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllFormData, deleteFormData, exportToCSV } from '../utils/csvExport';
import './DataList.css';

interface FormData {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export const DataList = () => {
  const [data, setData] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const formData = getAllFormData();
    setData(formData);
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteFormData(id);
      loadData();
    }
  };

  const handleExport = () => {
    exportToCSV();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="data-list-container">
      <div className="list-header">
        <h1>Submitted Data</h1>
        <div className="header-actions">
          <button onClick={handleExport} className="export-btn" disabled={data.length === 0}>
            📥 Export to CSV
          </button>
          <Link to="/" className="back-btn">
            ← Back to Form
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">
          <p>No submissions yet</p>
          <Link to="/" className="link-btn">
            Go to Form
          </Link>
        </div>
      ) : (
        <>
          <div className="count-info">Total submissions: {data.length}</div>
          <div className="data-grid">
            {data.map((item) => (
              <div key={item.id} className="data-card">
                <div className="card-header">
                  <div>
                    <h3>{item.name}</h3>
                    <p className="email">{item.email}</p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                    title="Delete this entry"
                  >
                    ✕
                  </button>
                </div>
                <p className="message">{item.message}</p>
                <p className="timestamp">{formatDate(item.timestamp)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
