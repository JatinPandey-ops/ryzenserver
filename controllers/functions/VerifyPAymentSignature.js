import crypto from "crypto"

export default function VerifyPAymentSignature(orderId, paymentId, signature, secret) {
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  return generatedSignature === signature;
}
