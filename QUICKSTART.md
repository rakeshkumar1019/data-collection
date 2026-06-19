# Quick Start Guide

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Step 1: Start the Backend Server
Open a terminal and run:
```bash
npm run server
```

You should see:
```
✓ Server running at http://localhost:5000
✓ Data stored in: /path/to/data

API Endpoints:
  GET    /data              - Get all submissions
  GET    /data/:id          - Get specific submission
  GET    /data/stats        - Get submission statistics
  GET    /data/export/csv   - Export all data as CSV
  POST   /data              - Save new submission
  DELETE /data/:id          - Delete specific submission
  DELETE /data              - Clear all submissions
  GET    /health            - Health check
```

### Step 2: Start the Frontend (in a new terminal)
```bash
npm run dev
```

You should see:
```
VITE v8.0.12  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 3: Open in Browser
Visit `http://localhost:5173` in your browser

## How It Works

1. **Fill out the form** with your name/organization, email, and message
2. **Click "SEND MESSAGE"** - data is sent to the backend API at `/data`
3. **View submission count** in the Data Management panel
4. **Export to CSV** - download all submissions as a CSV file
5. **Clear data** - delete all stored submissions

## File Locations

- **Form submissions are stored in:** `/data/submissions.json`
- **Frontend code:** `/src/`
- **Backend code:** `/server.js`
- **API service:** `/src/services/api.ts`

## Common Issues

### "Server is not connected" error
**Solution:** Make sure you're running `npm run server` in another terminal

### Port already in use
If port 5000 is already in use, edit the `PORT` variable in `server.js`:
```javascript
const PORT = 5000; // Change this to another port like 5001
```

Then update the API URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5001'; // Update to your port
```

## Additional Commands

- `npm run dev:full` - Run both server and frontend together (requires concurrently)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## API Reference

For detailed API documentation, see [API_DOCS.md](API_DOCS.md)
