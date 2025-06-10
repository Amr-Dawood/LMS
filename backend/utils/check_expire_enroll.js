const cron = require("node-cron");
const Enrollment = require("../models/enrollment.model"); // Import your Enrollment model
const send_Email = require("../utils/send_Email"); // Your email function
const removeExpiredEnrollments = require('./auto_remove');


// Schedule job to run every day at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Running expiration reminder job...");

    const today = new Date();
    const reminderDate = new Date(today.setDate(today.getDate() + 3)); // 3 days before expiration

    // Find enrollments expiring in 3 days
    const expiringEnrollments = await Enrollment.find({
        expiration_date: { $lte: reminderDate, $gt: today },
        is_expired: false
    }).populate("student", "email");

    for (const enrollment of expiringEnrollments) {
        await send_Email({
            email: enrollment.student.email,
            subject: "Your Course Enrollment is Expiring Soon!",
            message: `Hello, your enrollment for course ${enrollment.course} will expire soon. Renew now!`
        });
    }
    console.log(`✅ Sent ${expiringEnrollments.length} expiration reminders.`);
});


cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Running daily cleanup for expired enrollments...');
    await removeExpiredEnrollments();
});
