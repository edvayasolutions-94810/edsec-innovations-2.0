const mongoose = require('mongoose');

async function updateDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/edsec');
    const db = mongoose.connection.db;

    const result1 = await db.collection('students').updateMany(
      { course_name: 'Skill Enhancement Program' },
      { $set: { course_name: 'Foundation Tech Program' } }
    );
    console.log('Foundation Tech records replaced:', result1.modifiedCount);

    const result2 = await db.collection('students').updateMany(
      { course_name: 'Industry Internship Program' },
      { $set: { course_name: 'Applied Technology Program' } }
    );
    console.log('Applied Technology records replaced:', result2.modifiedCount);

    const result3 = await db.collection('students').updateMany(
      { course_name: { $in: ['Advanced Internship Program', 'Advanced Industry Internship Program', 'Advanced Industry Internship'] } },
      { $set: { course_name: 'Advanced AI & Software Engineering Program' } }
    );
    console.log('Advanced AI records replaced:', result3.modifiedCount);

    console.log('Database update complete');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

updateDB();
