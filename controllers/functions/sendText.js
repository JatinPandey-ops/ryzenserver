import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import { db } from "../../firebase.js";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const sendtext = async (message,uuid,psid)=> {
try {
  
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  function trimString(str) {
    if (str.length > 2000) {
      return str.substring(0, 2000);
    }
    return str;
  }
  
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: message,
  });
  const response = completion.data.choices[0].message;
  const botText = trimString(response.content)
  const resData = {
    uid: uuid(),
    role: response.role,
    content:botText,
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
        text: `${botText}`,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
} catch (error) {
  console.log(error)
}

        


} 

export default sendtext