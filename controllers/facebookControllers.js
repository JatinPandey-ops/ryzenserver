import axios from "axios";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { v4 as uuid } from "uuid";
import { db } from "../firebase.js";
import sendtext from "./sendText.js";

export const getWebhook = async (req, res) => {
  console.log(`\u{1F7EA} Received webhook:`);
  if (req.body.object === "page") {
    try {
      const webhook_event = req.body.entry[0];
      const psid = webhook_event.messaging[0].sender.id;
      const text = webhook_event.messaging[0].message.text;
      console.log(psid);
      console.log(text);
      // const psid = 4835495889835312
      // const text = "tell me about bears"
   
      const userText = {
        uid: uuid(),
        role: "user",
        content: text,
      };
      
      const docSnap = await getDoc(doc(db, "conversations", `${psid}@facebook.com`));
      if (docSnap.exists()) {
        await updateDoc(doc(db, "conversations", `${psid}@facebook.com`), {
          messages:arrayUnion(userText)
        });
        res.status(200).json("Received");
    
        sendtext(docSnap,uuid,psid,text)
        
      } else {
        await setDoc(doc(db, "conversations", `${psid}@facebook.com`), {
          messages: [
            { role: "system", content: "You are a helpful friend." },
            {
              role: "user",
              content:
                "Your nickname is ryzen and behave like a friend",
            },
          ],
        });
        res.status(200).json("Received");
        const docSnap = await getDoc(doc(db, "conversations", `${psid}@facebook.com`));
        sendtext(docSnap,uuid,psid,text)
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(404);
  }
};
