// whatsapp.service.ts
export const sendWhatsAppMessage = async (phone: string, message: string) => {
  // محاكاة إرسال رسالة واتساب
  // في الواقع ستقوم بربط Twilio أو WPPConnect أو WhatsApp Cloud API
  console.log(`✅ [WhatsApp API] Sending to ${phone}:`);
  console.log(message);
  return { success: true, timestamp: new Date() };
};
