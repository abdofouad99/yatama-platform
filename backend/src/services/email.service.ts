// email.service.ts
export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  // محاكاة إرسال إيميل
  // في الواقع ستقوم بربط Nodemailer أو SendGrid أو AWS SES
  console.log(`✉️ [Email API] Sending to ${to} | Subject: ${subject}`);
  return { success: true, timestamp: new Date() };
};
