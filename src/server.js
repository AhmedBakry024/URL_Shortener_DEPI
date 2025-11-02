/**
 * Main Server File
 * Initializes the Express application and starts the HTTP server
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const routes = require('./routes');
const { collectDefaultMetrics } = require('prom-client');

// Collect default Prometheus metrics (CPU, memory, etc.)
collectDefaultMetrics({ timeout: 5000 });

// Environment variables with defaults
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Create Express application
const app = express();

/**
 * Middleware Configuration
 */

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// CORS headers for cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

/**
 * Routes
 */

// API routes
app.use('/', routes);

// Direct endpoint for listing all quotes when router is not mounted yet
app.get('/quotes', async (req, res, next) => {
  try {
    const quotes = await db.getAllQuotes();
    res.json({
      success: true,
      data: quotes
    });
  } catch (error) {
    console.error('Error fetching quotes collection:', error);
    next(error);
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Quote Generator Service API',
    version: '1.0.0',
    endpoints: {
      'GET /quote': 'Get a random quote',
      'GET /quotes': 'List all quotes',
      'POST /quote': 'Add a new quote',
      'GET /stats': 'Get service statistics',
      'GET /metrics': 'Get Prometheus metrics',
      'GET /health': 'Health check endpoint'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

/**
 * Server Initialization
 */

async function startServer() {
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`Created data directory at ${dataDir}`);
    }
    
    // Initialize database
    console.log('Initializing database...');
    await db.initialize();
    console.log('Database initialized successfully');
    
    // Start HTTP server
    const server = app.listen(PORT, HOST, () => {
      console.log('='.repeat(60));
      console.log('Quote Generator Service');
      console.log('='.repeat(60));
      console.log(`Server running at http://${HOST}:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Process ID: ${process.pid}`);
      console.log('='.repeat(60));
      console.log('Available endpoints:');
      console.log(`  GET  http://${HOST}:${PORT}/quote     - Get random quote`);
  console.log(`  GET  http://${HOST}:${PORT}/quotes    - List all quotes`);
      console.log(`  POST http://${HOST}:${PORT}/quote     - Add new quote`);
      console.log(`  GET  http://${HOST}:${PORT}/stats     - Get statistics`);
      console.log(`  GET  http://${HOST}:${PORT}/metrics   - Get Prometheus metrics`);
      console.log(`  GET  http://${HOST}:${PORT}/health    - Health check`);
      console.log('='.repeat(60));
    });
    
    // Graceful shutdown handler
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed');
        
        // Close database connection
        db.close();
        
        console.log('Graceful shutdown completed');
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
