// payments.service.ts
export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  // محاكاة لإنشاء نية دفع Stripe
  console.log(`💳 [Stripe API] Creating Payment Intent for ${amount} ${currency}`);
  return {
    clientSecret: 'pi_test_123456789_secret_example',
    transactionId: 'txn_mock_' + Math.floor(Math.random() * 1000)
  };
};
