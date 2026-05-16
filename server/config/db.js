const dns = require('dns');
const mongoose = require('mongoose');

/**
 * On Windows, Node's default DNS resolver often fails mongodb+srv SRV lookups with
 * querySrv ECONNREFUSED even when the connection string and Atlas IP allowlist are
 * correct (system tools like nslookup still resolve). Using explicit DNS fixes it.
 */
function configureDnsForMongoSrv(uri) {
  if (!uri || !uri.startsWith('mongodb+srv://')) return;
  if (process.env.MONGO_DNS_USE_SYSTEM === '1') return;
  if (process.env.DNS_SERVERS) {
    dns.setServers(
      process.env.DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean),
    );
    return;
  }
  if (process.platform === 'win32') {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
}

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in server/.env');
  }

  configureDnsForMongoSrv(process.env.MONGODB_URI);

  console.log('⏳ Connecting to MongoDB...');

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'peblo_neural',
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
  });

  console.log('✅ MongoDB connected:', mongoose.connection.host);

  // Fix legacy notes: stored shareId: null breaks unique index (only one null allowed).
  const Note = require('../models/Note');
  const notesCol = mongoose.connection.collection('notes');
  const unsetResult = await notesCol.updateMany(
    { shareId: { $eq: null, $exists: true } },
    { $unset: { shareId: '' } },
  );
  if (unsetResult.modifiedCount > 0) {
    console.log(`🧹 Cleared stale shareId on ${unsetResult.modifiedCount} note(s)`);
  }
  try {
    await Note.syncIndexes();
  } catch (e) {
    console.warn('⚠️  Index sync failed, retrying after drop shareId_1:', e.message);
    try {
      await notesCol.dropIndex('shareId_1');
      await Note.syncIndexes();
    } catch (e2) {
      console.warn('⚠️  Index sync:', e2.message);
    }
  }
};

module.exports = connectDB;
