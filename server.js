const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bansalkeshav082005@gmail.com', 
    pass: 'crzyfcndmidcudtz', 
  },
});


const sendEmail = async (to, subject, content) => {
  const mailOptions = {
    from:'bansalkeshav082005@gmail.com',
    to,
    subject:'Your daily insiders',
    html: content,
  };

  try {
    const { response } = await transporter.sendMail(mailOptions);
    console.log('Email sent:', response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};


app.post('/register', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.error('No email provided');
    return res.status(400).send('Email is required');
  }

  console.log(`Received email from: ${email}`);

  try {
    const emailSent = await sendEmail(
      email,
      'Welcome! Please verify your email',
      '<h1>Thank you for signing up!</h1><p>Please check your inbox to confirm.</p>'
    );

    if (emailSent) {
      res.send(`<h2> Thanks for using our website for sending mail
        <br> </br> </h2><p>Email is sent to this ${email}.</p>`);
    } else {
      res.status(500).send("Failed to send email.");
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send("An error occurred. Please try again later.");
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});