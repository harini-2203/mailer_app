const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the uploads folder is used
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Email sending route
app.post('/send-email', upload.array('attachments'), async (req, res) => {
    const { email, subject, content } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jayasimma2580@gmail.com', // Replace with your email
            pass: 'fuoh lgxq tlef vvca',    // Replace with your email password
        },
    });

    // Adjust the path to use the correct directory
    const mailOptions = {
        from: 'jayasimma2580@gmail.com', // Replace with your email
        to: email,
        subject: subject,
        text: content,
        attachments: req.files.map(file => ({
            path: path.join(__dirname, 'uploads', file.filename), // Corrected path
        })),
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Error sending email', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
