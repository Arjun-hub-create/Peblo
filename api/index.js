/**
 * Vercel serverless entry — same Express app as local server.
 */
const { app } = require('../server/app');

module.exports = app;
