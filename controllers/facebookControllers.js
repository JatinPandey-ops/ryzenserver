import axios from "axios";
import { Configuration, OpenAIApi } from "openai"

export const getWebhook = async (req, res) => {
    console.log(`\u{1F7EA} Received webhook:`);
    if (req.body.object === "page") {
   
        res.status(200)
        console.log(req.body)
  
    } else {
      res.status(404);
    }
  }

















//   const response = await axios.get(`https://graph.facebook.com/v16.0/${process.env.FB_PAGE_ID}/conversations?fields=participants&access_token=${process.env.VERIFY_TOKEN}`)
//   const resData = response.data.data
//   resData.forEach(object => {
//       const convoId = object.id
//       const psid = object.participants.data[0].id
//       const fetchChats = async () => {
//           const fetch = await axios.get(`https://graph.facebook.com/v16.0/${convoId}?fields=messages{message}&access_token=${process.env.VERIFY_TOKEN}`)
//           const chat = fetch.data.messages.data
//           let counter = 0
//           const message = chat.map((msg) => {
//               const role = counter % 2 === 0? "user" : "asistant";
//               counter ++;
//               return {
//                   role,
//                   message: msg.message
//               }
//           })
//           console.log(message)
//           const configuration = new Configuration({
//               apiKey: process.env.OPENAI_API_KEY,
//             });
//             const openai = new OpenAIApi(configuration);
            
//             const completion = await openai.createChatCompletion({
//               model: "gpt-3.5-turbo",
//               messages : message
//             });
//             const botRes = completion.data.choices[0].message
//       }
//       fetchChats()
//   });