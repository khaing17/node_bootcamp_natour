const nodemailer = require('nodemailer');
const { options } = require('../routes/auth.route');

const sendEmail = async (options) => {
  //Define a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //Define an email
  const mailOptions = {
    from: 'Aung Thet Khaing <aungtkhaing.dev@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
