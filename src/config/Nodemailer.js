const nodemailer = require("nodemailer");

exports.sendActivate = async (email) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM, // sender address
    to: email, // list of receivers
    subject: "Account Activation Link", // Subject line
    // text: "Activation Account", // plain text body
    html: `
      <h2>Please click on given link to activae you account</h2>
    <p>${process.env.CLIENT_URL}/authentication/activate</p>
    `, // html body
  });
  console.log("Message sent: %s", info);
  return info;
};

exports.sendForgotPassword = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM, // sender address
      to: email, // list of receivers
      subject: "Reset Password Link", // Subject linea
      // text: "Activation Account", // plain text body
      html: `
      <h2>Please click on given link to activae you account</h2>
    <p>${process.env.CLIENT_URL}/authentication/reset-password/${token}</p>
    <a href="${process.env.CLIENT_URL}/authentication/reset-password/${token}" target="_blank">click here</a>
    `, // html body
    });
    console.log("Message sent: %s", info);
    return info;
  } catch (err) {
    return null;
  }
};
