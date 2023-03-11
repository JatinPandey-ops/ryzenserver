import axios from "axios";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Configuration, OpenAIApi } from "openai"
import { db } from "../firebase.js";

export const getWebhook = async (req, res) => {
  console.log(`\u{1F7EA} Received webhook:`);
  if (req.body.object === "page") {
    try {
      const webhook_event = req.body.entry[0]
      const psid = webhook_event.messaging[0].sender.psid
      const text = webhook_event.messaging[0].text
      console.log(psid)
      console.log(text)
      await setDoc(doc(db, "conversations", `${psid}@facebook.com` ), {
        messages: [
          {role: "system", content: "You are a helpful friend."},
          {role: "user", content: "Your nickname is ryzen.Introduce yourself as Ryzen and behave like a friend"},
        ],
      });
      const userText = {
        role :'user',
        content:text
      }
      const docRef = doc(db, "conversations",`${psid}@facebook.com`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        
        await updateDoc(doc(db, "conversations", `${psid}@facebook.com`), {
          
          messages: arrayUnion(userText)
        });
        res.status(200).json("Received")
        const message = await docSnap.data().messages
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages : message
        });
        const response = completion.data.choices[0].message
        const resData = {
          role: response.role,
          content: response.content
        }
        await axios.post(`https://graph.facebook.com/v16.0/105376291989178/messages?recipient={id:${psid}}&message={text:'${response.content}'}&messaging_type=RESPONSE&access_token=${process.env.FB_VERIFY_TOKEN}`)
        await updateDoc(doc(db, "conversations", `${psid}@facebook.com`), {
          
              messages: arrayUnion(resData)
            });
        } else {
            console.log("something went wrong")
        }
        } catch (error) {
            console.log(error)
        }

  
    } else {
      res.status(404);
    }
  }














