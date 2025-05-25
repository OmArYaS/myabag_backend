import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  // إنشاء transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER, // الإيميل بتاعك
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  // إعداد الرسالة
  const mailOptions = {
    from: `"MYABAG" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  // الإرسال
  await transporter.sendMail(mailOptions);
};
