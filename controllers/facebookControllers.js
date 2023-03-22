import axios from "axios";
import botRes from "./functions/botResponse.js";

export const getWebhook = async (req, res) => {
  console.log(`\u{1F7EA} Received webhook:`);
  if (req.body.object === "page") {
    try {
      const webhook_event = req.body.entry[0];
      const psid = webhook_event.messaging[0].sender.id;
      const text = webhook_event.messaging[0].message.text;
      // console.log(psid);
      // console.log(text);
      // const psid = 4835495889835312;
      // const text = "hii Ryzen";




       await botRes( text, psid);
       res.status(200).json("Received")
      
    } catch (error) {
      await axios.post(
        `https://graph.facebook.com/v16.0/${process.env.FB_PAGE_ID}/messages?&access_token=${process.env.FB_VERIFY_TOKEN}`,
        {
          recipient: {
            id: `${psid}`,
          },
          messaging_type: "RESPONSE",
          message: {
            text: "Something went wrong!Please try again later.🙂",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      res.status(200).json("Error")

    }
  } else {
    res.status(404);
  }
};
