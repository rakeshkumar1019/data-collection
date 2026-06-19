import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

/**
 * GET /data - Retrieve all form submissions
 */
app.get('/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve data' });
  }
});

/**
 * GET /data/:id - Retrieve a specific submission by ID
 */
app.get('/data/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const submission = data.find(item => item.id === req.params.id);
    
    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }
    
    res.json({ success: true, data: submission });
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve data' });
  }
});

/**
 * POST /data - Save a new form submission
 */
app.post('/data', (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, message'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const newSubmission = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ipAddress: req.ip
    };

    data.push(newSubmission);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    res.status(201).json({
      success: true,
      message: 'Data saved successfully',
      data: newSubmission
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ success: false, error: 'Failed to save data' });
  }
});

/**
 * DELETE /data/:id - Delete a specific submission
 */
app.delete('/data/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const filteredData = data.filter(item => item.id !== req.params.id);

    if (data.length === filteredData.length) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(filteredData, null, 2));

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ success: false, error: 'Failed to delete data' });
  }
});

/**
 * DELETE /data - Clear all submissions
 */
app.delete('/data', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    res.json({
      success: true,
      message: 'All submissions cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ success: false, error: 'Failed to clear data' });
  }
});

/**
 * GET /data/export/csv - Export all data as CSV
 */
app.get('/data/export/csv', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    if (data.length === 0) {
      return res.status(400).json({ success: false, error: 'No data to export' });
    }

    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Message', 'Timestamp', 'IP Address'];
    const rows = data.map(item => [
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      item.email,
      `"${item.message.replace(/"/g, '""')}"`,
      item.timestamp,
      item.ipAddress || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Set response headers
    res.setHeader('Content-Type', 'text/csv;charset=utf-8;');
    res.setHeader('Content-Disposition', `attachment;filename=form_data_${new Date().toISOString().split('T')[0]}.csv`);
    
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ success: false, error: 'Failed to export CSV' });
  }
});

/**
 * GET /data/stats - Get statistics about submissions
 */
app.get('/data/stats', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    const stats = {
      totalSubmissions: data.length,
      latestSubmission: data.length > 0 ? data[data.length - 1] : null,
      uniqueEmails: new Set(data.map(item => item.email)).size
    };

    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Data stored in: ${DATA_DIR}`);
  console.log(`
API Endpoints:
  GET    /data              - Get all submissions
  GET    /data/:id          - Get specific submission
  GET    /data/stats        - Get submission statistics
  GET    /data/export/csv   - Export all data as CSV
  POST   /data              - Save new submission
  DELETE /data/:id          - Delete specific submission
  DELETE /data              - Clear all submissions
  GET    /health            - Health check
  `);
});
