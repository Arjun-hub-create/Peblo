const { app, initApp } = require('./app');

initApp()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('\n========================================');
      console.log('🧠  Peblo Neural Workspace — RUNNING');
      console.log(`🚀  http://localhost:${PORT}`);
      console.log(`🔍  Health: http://localhost:${PORT}/api/health`);
      console.log('========================================\n');
    });
  })
  .catch((err) => {
    console.error('\n❌ Failed to connect to MongoDB:', err.message);
    console.error('👉 Check your MONGODB_URI in server/.env\n');
    process.exit(1);
  });
