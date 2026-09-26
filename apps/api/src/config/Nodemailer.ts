const nodemailer = require("nodemailer");

const sendActivate = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? "", 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Account Activation Link",
    html: `
      <h2>Please click on given link to activae you account</h2>
    <p>${process.env.CLIENT_URL}/authentication/activate</p>
    `,
  });
  console.log("Message sent: %s", info);
  return info;
};

const sendForgotPassword = async (email: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? "", 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Reset Password Link",
      html: `
      <h2>Please click on given link to activae you account</h2>
    <p>${process.env.CLIENT_URL}/authentication/reset-password/${token}</p>
    <a href="${process.env.CLIENT_URL}/authentication/reset-password/${token}" target="_blank">click here</a>
    `,
    });
    console.log("Message sent: %s", info);
    return info;
  } catch {
    return null;
  }
};

export = { sendActivate, sendForgotPassword };
