import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Render an EJS email template
const renderTemplate = async (templateName: string, data: any): Promise<string> => {
  const templatePath = path.join(
    process.cwd(),
    'auth-service',
    'src',
    'utils',
    'email-templates',
    `${templateName}.ejs`,
  );
  return ejs.renderFile(templatePath, data);
};

// Send email function
export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  templateData: Record<string, any>,
) => {
  try {
    const htmlContent = await renderTemplate(templateName, templateData);

    const mailOptions = {
      from: process.env.SMTP_USER || '"No Reply" <noreply@example.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      html: htmlContent, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.info(`Email sent: ${info.messageId} to ${to}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}: ${error}`);
    return false;
  }
};
