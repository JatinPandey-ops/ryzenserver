import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import { db } from "../firebase.js";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const sendtext = async (docSnap,uuid,psid)=> {
    const messageArr = await docSnap.data().messages;
        const message = messageArr.map(({ uid, ...others }) => others);
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: message,
        });
        const response = completion.data.choices[0].message;
        const resData = {
          uid: uuid(),
          role: response.role,
          content: response.content,
        };
        await updateDoc(doc(db, "conversations", `${psid}@facebook.com`), {
          messages: arrayUnion(resData)
        });

        await axios.post(
          `https://graph.facebook.com/v16.0/${process.env.FB_PAGE_ID}/messages?&access_token=${process.env.FB_VERIFY_TOKEN}`,
          {
            recipient: {
              id: `${psid}`,
            },
            messaging_type: "RESPONSE",
            message: {
              text: `${response.content}`,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

} 

export default sendtext