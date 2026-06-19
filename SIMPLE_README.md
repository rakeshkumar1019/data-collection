# Data Collection Form

A simple React app for collecting form data and exporting to CSV.

## Features

- 📝 Simple form to collect name, email, and message
- 💾 Data saved to browser localStorage
- 📊 View all submissions on `/data` page
- 📥 Export all data to CSV file
- 🗑️ Delete individual submissions

## Installation

```bash
npm install
```

## Running the App

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser

## Usage

1. **Submit Form**: Fill out the form on the home page and click "SEND MESSAGE"
2. **View Data**: Go to `/data` page to see all submissions
3. **Export**: Click "Export to CSV" to download data
4. **Delete**: Click the ✕ button on any submission to delete it

## Project Structure

```
src/
├── components/
│   ├── QuickMessageForm.tsx     # Form component
│   ├── DataList.tsx              # Data listing component
│   ├── QuickMessageForm.css
│   └── DataList.css
├── utils/
│   └── csvExport.ts              # Data management utilities
├── App.tsx                        # Main app with routing
└── main.tsx                       # Entry point
```

## Routes

- `/` - Form submission page
- `/data` - View all submissions

## Data Storage

All data is stored in browser's localStorage under the key `formData`.

## Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder.
