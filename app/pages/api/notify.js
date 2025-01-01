import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // your email address
        pass: process.env.EMAIL_PASSWORD, // your email password or app password
    },
});

app.post('/api/notify', async (req, res) => {
    const { email } = req.body;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Notify Me - Coming Soon',
        text: 'Thank you for signing up! We will notify you when the update is available.',
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Notification email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('An error occurred while sending the email.');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
