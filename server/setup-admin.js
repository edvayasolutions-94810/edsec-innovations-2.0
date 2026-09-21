/**
 * One-time Admin Setup Script
 * Run once: node setup-admin.js
 * After running, DELETE this file or keep it private.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
    email: { type: String },
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true }
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.argv[2];
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.argv[3];

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be provided via environment variables or command line arguments:');
    console.error('   Usage: node setup-admin.js <email> <password>');
    console.error('   Or: ADMIN_EMAIL=... ADMIN_PASSWORD=... node setup-admin.js');
    process.exit(1);
}

async function setup() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        console.error('❌ Error: MONGODB_URI environment variable is required.');
        process.exit(1);
    }
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_EMAIL }] });
    if (existing) {
        console.log('⚠️  Admin already exists. Updating password...');
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        await Admin.updateOne({ _id: existing._id }, { password_hash: hash, email: ADMIN_EMAIL, username: ADMIN_EMAIL });
        console.log('✅ Admin password updated.');
    } else {
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        await Admin.create({ email: ADMIN_EMAIL, username: ADMIN_EMAIL, password_hash: hash });
        console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
    }

    await mongoose.disconnect();
    console.log('\n🎉 Admin account successfully configured.');
}

setup().catch(err => { console.error(err); process.exit(1); });
