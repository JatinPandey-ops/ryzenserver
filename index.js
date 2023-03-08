import Express from "express";
import authRoute from "./routes/authRoute.js";
import chatRoute from "./routes/chatRoute.js";
import dotenv from "dotenv";

const app = Express();
const port = process.env.PORT || 8000;
dotenv.config();

app.use(Express.json());
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.post("/webhook", (req, res) => {
  console.log(`\u{1F7EA} Received webhook:`);
  if (req.body.object === "page") {
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.status(404);
  }
});
app.get("/messaging-webhook", (req, res) => {
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token =
    req.query[
      "EAAbCHOLZBjoIBAEdfG5gHK0ZCRc0FyZBZAFZC1ZBI1LlazweMk4ZCaS5Cp7N5HwFhKdQatEniAktKHt2X66GRPr3vlJgwxBuOOcxNb3OXzOnQwmNpjXOY8GdkTo56oxxjVuAw7zMmiZCoarXRQulFVKhZAoiFdAvOAMI4ZBBGvl3dCN6nZCJlsbZCgZCRY0XtEsPFTEIZD"
    ];
  let challenge = req.query["1234567654321`"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === config.verifyToken) {
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
