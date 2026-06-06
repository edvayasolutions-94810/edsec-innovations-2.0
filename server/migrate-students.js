const mongoose = require('mongoose');
const Student = require('./src/models/Student');
const Batch = require('./src/models/Batch');

async function migrate() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect('mongodb://127.0.0.1:27017/edsec');
        console.log('Connected!');

        const students = await Student.find();
        console.log(`Found ${students.length} students to migrate.`);

        let migratedCount = 0;
        let deletedCount = 0;

        for (let student of students) {
            // Check if record is incomplete/corrupted
            if (!student.full_name || !student.course_name) {
                console.log(`Deleting incomplete/corrupt student record with ID: ${student._id}`);
                await Student.findByIdAndDelete(student._id);
                deletedCount++;
                continue;
            }

            let modified = false;

            // 1. Enrollment ID
            if (!student.enrollment_id) {
                const rand = Math.floor(1000 + Math.random() * 9000);
                const year = student.enrollment_date ? new Date(student.enrollment_date).getFullYear() : new Date().getFullYear();
                student.enrollment_id = `EDSEC-${year}-${rand}`;
                modified = true;
            }

            // 2. Map old status values
            if (student.status === 'Selected' || student.status === 'Not Selected' || !student.status) {
                if (student.status === 'Selected') {
                    student.status = 'Approved';
                } else {
                    student.status = 'New Application';
                }
                modified = true;
            }

            // 3. Set Program Fee based on Course Title
            if (!student.program_fee || student.program_fee === 0) {
                const course = (student.course_name || '').toLowerCase();
                if (course.includes('foundation') || course.includes('1-month')) {
                    student.program_fee = 1999;
                } else if (course.includes('advanced') || course.includes('3-month') || course.includes('applied')) {
                    student.program_fee = 3499;
                } else if (course.includes('professional') || course.includes('5-month') || course.includes('advanced ai')) {
                    student.program_fee = 4999;
                } else {
                    student.program_fee = 1999; // Fallback
                }
                modified = true;
            }

            // 4. Map amount paid
            if (!student.amount_paid || student.amount_paid === 0) {
                if (student.payment_status === 'Paid') {
                    student.amount_paid = student.program_fee;
                } else {
                    // Try parsing price_paid string if it exists
                    if (student.price_paid) {
                        const parsed = parseInt(student.price_paid.replace(/[^0-9]/g, ''));
                        if (!isNaN(parsed)) {
                            student.amount_paid = parsed;
                        } else {
                            student.amount_paid = 0;
                        }
                    } else {
                        student.amount_paid = 0;
                    }
                }
                modified = true;
            }

            // 5. Remaining Balance
            const targetBalance = Math.max(0, student.program_fee - student.amount_paid);
            if (student.remaining_balance !== targetBalance) {
                student.remaining_balance = targetBalance;
                modified = true;
            }

            // 6. Payment Status Enum Alignment
            let expectedPayStatus = 'Unpaid';
            if (student.amount_paid > 0) {
                if (student.remaining_balance <= 0) {
                    expectedPayStatus = 'Paid';
                } else {
                    expectedPayStatus = 'Partially Paid';
                }
            }
            if (student.payment_status !== expectedPayStatus) {
                student.payment_status = expectedPayStatus;
                modified = true;
            }

            if (modified) {
                await student.save();
                migratedCount++;
            }
        }

        console.log(`Migration complete. Updated ${migratedCount} records, deleted ${deletedCount} corrupt records.`);
        
        // Output summary check
        const sample = await Student.findOne();
        if (sample) {
            console.log('Sample Migrated Student Record:', {
                name: sample.full_name,
                id: sample.enrollment_id,
                status: sample.status,
                fee: sample.program_fee,
                paid: sample.amount_paid,
                balance: sample.remaining_balance,
                paymentStatus: sample.payment_status
            });
        }

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

migrate();
