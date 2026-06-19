# Form Data Collection - API Documentation

## Setup Instructions

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

You have two options:

### Option 1: Run Frontend and Backend Separately (Recommended for Development)

**Terminal 1 - Start the Backend Server:**
```bash
npm run server
```
The server will run on `http://localhost:5000`

**Terminal 2 - Start the Frontend Dev Server:**
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

### Option 2: Run Both Together (If you have concurrently installed)
```bash
npm run dev:full
```

## API Endpoints

### Base URL
```
http://localhost:5000
```

### 1. Get All Submissions
```
GET /data
```
**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "1718827234567-abc123def45",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Interested in your services",
      "timestamp": "2026-06-19T10:00:00.000Z",
      "ipAddress": "127.0.0.1"
    }
  ]
}
```

### 2. Get Specific Submission
```
GET /data/:id
```
**Parameters:**
- `id` (string): Submission ID

**Response:**
```json
{
  "success": true,
  "data": { /* submission object */ }
}
```

### 3. Save New Submission
```
POST /data
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Data saved successfully",
  "data": {
    "id": "1718827234567-abc123def45",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Your message here",
    "timestamp": "2026-06-19T10:00:00.000Z",
    "ipAddress": "127.0.0.1"
  }
}
```

### 4. Delete Specific Submission
```
DELETE /data/:id
```
**Parameters:**
- `id` (string): Submission ID

**Response:**
```json
{
  "success": true,
  "message": "Submission deleted successfully"
}
```

### 5. Clear All Submissions
```
DELETE /data
```
**Response:**
```json
{
  "success": true,
  "message": "All submissions cleared successfully"
}
```

### 6. Export Data as CSV
```
GET /data/export/csv
```
**Response:** CSV file download

**File Format:**
```
ID,Name,Email,Message,Timestamp,IP Address
"1718827234567-abc123def45","John Doe","john@example.com","Your message here","2026-06-19T10:00:00.000Z","127.0.0.1"
```

### 7. Get Statistics
```
GET /data/stats
```
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalSubmissions": 5,
    "latestSubmission": { /* submission object */ },
    "uniqueEmails": 4
  }
}
```

### 8. Health Check
```
GET /health
```
**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Data Storage

Form submissions are stored in:
```
./data/submissions.json
```

This file is automatically created when you first run the server.

## Error Handling

All endpoints return error responses in this format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Errors

- **400 Bad Request**: Missing required fields or invalid email format
- **404 Not Found**: Submission ID not found or endpoint not found
- **500 Internal Server Error**: Server error occurred

## Frontend Integration

The frontend is already configured to use the API. No additional setup is needed.

### Features
- ✓ Form submission to `/data` endpoint
- ✓ Real-time server connection status
- ✓ CSV export of all submissions
- ✓ Delete individual or all submissions
- ✓ View submission count
- ✓ Error handling and user feedback

## Development

### Project Structure
```
.
├── server.js                 # Express server with API endpoints
├── src/
│   ├── services/
│   │   └── api.ts           # API client functions
│   ├── components/
│   │   ├── QuickMessageForm.tsx
│   │   └── DataExportPanel.tsx
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── tsconfig.json
```

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Notes

- The server stores data in JSON format for simplicity. For production, consider using a database.
- CORS is enabled for local development. Adjust this in `server.js` if needed.
- The CSV export includes IP addresses for reference tracking.
