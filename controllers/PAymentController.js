import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import stripe from "../Stripe.js";
import instance from "../Razorpay.js";
import verifyPaymentSignature from "./functions/VerifyPAymentSignature.js";
import axios from "axios";
import { createError } from "../error.js";
import crypto from "crypto";

export const handleEvent = async (req, res, next) => {
  try {
  
  } catch (error) {}
};
export const verifyPayemnt = async (req, res, next) => {
  try {
    // const {
    //   razorpay_payment_id,
    //   razorpay_subscription_id,
    //   razorpay_signature,
    //   currency,
    //   amount,
    // } = req.body;
    // const keySecret = process.env.RAZOR_SECRET_KEY;
    // const response = await instance.payments.capture(
    //   razorpay_payment_id,
    //   amount,
    //   currency
    // );
    // const orderId = response.id;
    const webhookSecret = "jatin7788";

    const webhookRequestBody = req.body; // Replace with actual request body
    const requestBodyString = JSON.stringify(webhookRequestBody);
    // Convert the webhook request body to a Buffer
    const message = Buffer.from(requestBodyString, "utf-8");

    // Calculate the HMAC SHA256 hash
    const xRazorpaySignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(message)
      .digest("hex");

    console.log("Hash Signature:", xRazorpaySignature);
    const response = validateWebhookSignature(
      JSON.stringify(req.body),
      xRazorpaySignature,
      webhookSecret
    );
    console.log(req.body);
    if(response){
      return req.body

    }
    console.log("From verify payment", req.body)
    // const isSignatureValid = verifyPaymentSignature(
    //   orderId,
    //   razorpay_payment_id,
    //   razorpay_signature,
    //   keySecret
    // );
    // if (isSignatureValid) {
    //   // Payment is successful
    //   console.log("Payment is authentic.");
    //   res.status(200).json(response);
    // } else {
    //   // Payment is not authentic
    //   console.log("Payment is not authentic.");
    //   next(createError(500, "Not verified"));
    // }
  } catch (error) {
    console.log(error);
  }
};
export const subscribe = async (req, response, next) => {
  try {
    const { EXPIRY_DATE } = req.body;
    console.log(EXPIRY_DATE);
    const res = await instance.subscriptions.create({
      plan_id: "plan_LqVE9WNiv097p4",
      total_count: 6,
      quantity: 1,
      customer_notify: 0,
      expire_by: EXPIRY_DATE,
    });
    response.status(200).json(res);
  } catch (error) {
    console.log(error);
  }
};
export const createCustomer = async (req, response, next) => {
  try {
    console.log("received");
    const { displayName, email, number } = req.body;
    const res = await instance.customers.create({
      name: displayName,
      contact: number,
      email: email,
      fail_existing: 0,
    });
    response.status(200).json(res);
  } catch (error) {
    console.log(error);
  }
};
