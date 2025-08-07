# Wealth Manager

A portfolio management application that parses Excel files and displays portfolio data through a modern web interface.

## Features

- Excel file parsing and data processing
- Portfolio holdings analysis
- Asset allocation visualization
- Performance tracking
- Real-time portfolio summary

## Project Structure

```
WealthManager/
├── client/          # Next.js frontend application
├── server/          # Express.js backend API
└── package.json     # Root package.json for managing both apps
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install:all
```

### 2. Start the Development Servers

```bash
# Start both server and client concurrently
npm run dev
```

This will start:
- **Backend Server**: http://localhost:3000
- **Frontend Client**: http://localhost:3001

### 3. Access the Application

Open your browser and navigate to: http://localhost:3001

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/portfolio/holdings` - Get portfolio holdings with calculations
- `GET /api/portfolio/allocation` - Get asset allocation by sector and market cap
- `GET /api/portfolio/performance` - Get historical performance data
- `GET /api/portfolio/summary` - Get portfolio summary and metrics

## Data Source

The application reads from an Excel file located at:
`server/data/Sample Portfolio Dataset for Assignment.xlsx`

The Excel file should contain the following sheets:
- **Holdings**: Portfolio holdings with columns like Symbol, Company Name, Quantity, etc.
- **Historical_Performance**: Performance timeline data
- **Summary**: Portfolio summary metrics

## Development

### Backend (Server)
- Located in `server/` directory
- Uses Express.js with CORS enabled
- Parses Excel files using the `xlsx` library
- Provides REST API endpoints

### Frontend (Client)
- Located in `client/` directory
- Built with Next.js 14 and TypeScript
- Uses Tailwind CSS for styling
- Includes various UI components from Radix UI

## Troubleshooting

1. **Port Conflicts**: Make sure ports 3000 and 3001 are available
2. **Excel File**: Ensure the Excel file exists in `server/data/`
3. **Dependencies**: Run `npm run install:all` if you encounter missing dependencies

## Scripts

- `npm run dev` - Start both development servers
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the frontend client
- `npm run build` - Build the frontend for production
- `npm run start` - Start the production server

## Deployment

To deploy this application to Vercel:

1. **Push your code to GitHub**
2. **Connect to Vercel**: Go to [vercel.com](https://vercel.com) and import your repository
3. **Deploy**: Vercel will automatically detect and deploy your application

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md). 