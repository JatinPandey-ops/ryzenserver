import Express from "express";
import authRoute from "./routes/authRoute.js";
import chatRoute from "./routes/chatRoute.js";
import dotenv from "dotenv";
import { getWebhook } from "./controllers/facebookControllers.js";

const app = Express();
const port = process.env.PORT || 8000;
dotenv.config();
app.get("/",(req,res) => {
    res.status(200).json("Connected")
})
app.use(Express.json());
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);




app.post("/webhook", getWebhook);





app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token =
    req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  let verify_token = process.env.VERIFY_TOKEN
  // console.log(mode)
  // console.log(token)
  // console.log(challenge)
  // console.log(verify_token)
  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.status(403);
    }
  }
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
