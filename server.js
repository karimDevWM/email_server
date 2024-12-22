const express = require("express");
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const dotEnv = require("dotenv");
const cors = require('cors')

dotEnv.config();

const app = express();
const port = process.env.SERVER_PORT

app.use(bodyParser.json());
// app.use(cors());

// const allowedOrigin = process.env.ANGULAR_ORIGIN;

// app.use(cors({
//     origin: (origin, callback) => {
//       // Check if the incoming origin is allowed
//       if (origin === allowedOrigin || !origin) {
//         callback(null, true); // Allow requests from the allowed origin
//       } else {
//         callback(new Error('Not allowed by CORS')); // Reject other origins
//       }
//     },
//     methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
//     allowedHeaders: ['Content-Type'],  // Allowed headers for requests
//     credentials: true, // If you need to allow cookies/auth headers
//   }));

const allowedOrigins = ['http://le_roi_shawarma.karim-portfolio.xyz'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // Allow requests with credentials
};

app.use(cors(corsOptions));

app.post("/send-email", async (request, response) => {
    const {name, email, message} = request.body;

    try {
        const transporter = nodeMailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            },
        });

        await transporter.sendMail({
            from:email,
            to: process.env.RECEIVER_EMAIL,
            suject: `Contact Form Submission from ${name}`,
            text: message,
        });

        response.status(200).send({ success: true, message: 'Email sent Successfully' })
    } catch (error) {
        console.error(error);
        response.status(500).send({ success: false, message: 'Failed to send email'})
    }
});

app.listen(port, '0.0.0.0', () => console.log(`Mail service listening on port ${port}`));