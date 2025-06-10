    const Enrollment = require('../models/enrollment.model');

    const removeExpiredEnrollments = async () => {
    try {
        const now = new Date();
        const deleted = await Enrollment.deleteMany({ enrollment_end: { $lt: now } });

        console.log(`✅ Removed ${deleted.deletedCount} expired enrollments.`);
    } catch (error) {
        console.error("❌ Error removing expired enrollments:", error);
    }
    };

    module.exports = removeExpiredEnrollments;
