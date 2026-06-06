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

const ADMIN_EMAIL = 'admin@edsec.com';       // ← Change this
const ADMIN_PASSWORD = 'Edsec@Admin2024';     // ← Change this to a strong password

async function setup() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_EMAIL }] });
    if (existing) {
        console.log('⚠️  Admin already exists. Updating password...');
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await Admin.updateOne({ _id: existing._id }, { password_hash: hash, email: ADMIN_EMAIL, username: ADMIN_EMAIL });
        console.log('✅ Admin password updated.');
    } else {
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await Admin.create({ email: ADMIN_EMAIL, username: ADMIN_EMAIL, password_hash: hash });
        console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
    }

    await mongoose.disconnect();
    console.log('\n🎉 Done! You can now login at http://localhost:8080/#/admin-login');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
}

setup().catch(err => { console.error(err); process.exit(1); });
