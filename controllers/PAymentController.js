import stripe from "../Stripe.js";


export const handlePayment = async  (req,res,next) =>{
    try {
        const amount = req.body.amount
        console.log("amount")
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
            currency: "inr",
            
            automatic_payment_methods: {
              enabled: true,
              
            },
          });
          res.json({ paymentIntent: paymentIntent.client_secret });
    } catch (error) {
      res.status(400).json({
        error: error.message,
    })
  }}