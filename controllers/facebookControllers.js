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
      // console.log(psid);
      // console.log(text);
      // const psid = 4835495889835312
      // const text = "hii"
   
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
        const docData = await getDoc(doc(db, "conversations", `${psid}@facebook.com`));
        const messageArr = await docData.data().messages;
        const message = messageArr.map(({ uid, ...others }) => others);
        sendtext(message,uuid,psid,text)
        res.status(200).json("Received webhook");
        
      } else {
        await setDoc(doc(db, "conversations", `${psid}@facebook.com`), {
          messages: [
            { role: "system", content: "You are a helpful friend and you will introduce yourself by name of ryzen." },
          ],
        });
        await updateDoc(doc(db, "conversations", `${psid}@facebook.com`), {
          messages:arrayUnion(userText)
        });
        const docSnap = await getDoc(doc(db, "conversations", `${psid}@facebook.com`));
        const messageArr = await docSnap.data().messages;
        const message = messageArr.map(({ uid, ...others }) => others);
        sendtext(message,uuid,psid,text)
        res.status(200).json("Received");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(404);
  }
};
