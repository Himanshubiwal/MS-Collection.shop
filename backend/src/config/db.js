import mongoose from 'mongoose';
import dns from 'dns';

let mongoMemoryServer = null;

export const connectDB = async () => {
  // Set Google/Cloudflare public DNS servers to bypass Windows/ISP SRV lookup blocks (querySrv ECONNREFUSED)
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (dnsErr) {
    // Ignore if custom DNS setting is restricted
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mscollection_store';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected Successfully]: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    // If the user has provided a custom Atlas cluster URI or remote URI, log the specific error clearly
    if (uri && !uri.includes('localhost') && !uri.includes('127.0.0.1')) {
      console.error(`[MongoDB Connection Failed]: Unable to connect to your remote MongoDB URI.`);
      console.error(`Error details: ${error.message}`);
      process.exit(1);
    }

    console.log(`[MongoDB Connection Note]: Local daemon offline (${error.message.split('\n')[0]}). Initiating temporary in-memory fallback server...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const fallbackUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(fallbackUri);
      console.log(`[MongoDB Connected via In-Memory Fallback]: ${conn.connection.host} (Ready for testing prior to custom URI!)`);
    } catch (fallbackError) {
      console.error(`[MongoDB Fallback Error]: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};
