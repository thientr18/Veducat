const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
    user: process.env.OUTLOOK_EMAIL,
    pass: process.env.OUTLOOK_PASSWORD,
    },
});

// Function to send email notifications to students
async function sendAnnouncementEmail(students, courseName, announcement) {
    for (const student of students) {
        const mailOptions = {
            from: process.env.OUTLOOK_EMAIL,
            to: student.email,
            subject: `${courseName}: ${announcement.title}`,
            text: `${announcement.content}\n\nAnnouncement from Veducat\nDate: ${announcement.createdAt}`,
        };
        
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${student.email}: ${info.response}`);
        } catch (error) {
            console.log(`Error sending email to ${student.email}: ${error}`);
        }
    }
}

module.exports = sendAnnouncementEmail;
