const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { orderId, name, email, phone, address, itemsText, total, paymentMethod } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ['shrikm68@gmail.com', email],  // Send to admin & customer
        subject: `New Order Received - ${orderId}`,
        text: `Hello,

A new order has been placed.

Order ID: ${orderId}
Customer: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Order Items:
${itemsText}

Total: ₹${total}
Payment Method: ${paymentMethod}

Thanks,
Archie's Halwa`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Email sending failed!', error });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
