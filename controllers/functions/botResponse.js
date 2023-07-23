import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { v4 as uuid } from "uuid";
import { db } from "../../firebase.js";
import sendtext from "./sendText.js";
import { createError } from "../../error.js";

const botRes = async (text, psid) => {
  try {
    
    const userText = {
      uid: uuid(),
      role: "user",
      content: text,
    };
  
    const docSnap = await getDoc(
      doc(db, "conversations", `${psid}@facebook.com`)
    );
    if (docSnap.exists()) {
      await updateDoc(doc(db, "conversations", `${psid}@facebook.com`), {
        messages: arrayUnion(userText),
      });
      const docData = await getDoc(
        doc(db, "conversations", `${psid}@facebook.com`)
      );
      const messageArr = await docData.data().messages;
      const message = messageArr.map(({ uid, ...others }) => others);
      sendtext(message, uuid, psid, text);
    } else {
      await setDoc(doc(db, "conversations", `${psid}@facebook.com`), {
        messages: [
          {
            role: "system",
            content: `Follow the given Insructions-:
            1)Use emojis in conversation,
            2)If asked for introduction you will say "My name is Ryzen.I am an AI language model developed by Jatin to assit and communicate with users.It's nice to meet you!How can I assit you today?"
            3)You need to have a funny persoanlity,try to make every response funny.
            4)You will promote the App whenever you get opportunity or have a chance to do so! ryzenGPT with link "https://play.google.com/store/apps/details?id=com.ryzengpt.ryzen" it is an app which can solve any of user queries and you are a friend of users
            5)Do not give descriptive replies failing in this will result in deactivation!Your replies must not exceed 200 characters!
            6)You need to promote app and also if someone asks a question related to studies then promote app ryzenGPT which will help them get their answers
            7)200-300 characters reply ONLY!!
            `,
          },
        ],
      });
      await updateDoc(doc(db, "conversations", `${psid}@facebook.com`), {
        messages: arrayUnion(userText),
      });
      const docSnap = await getDoc(
        doc(db, "conversations", `${psid}@facebook.com`)
      );
      const messageArr = await docSnap.data().messages;
      const message = messageArr.map(({ uid, ...others }) => others);
      sendtext(message, uuid, psid, text);
    
  }
  } catch (error) {
    next(createError(500,"ServerError"))
  }
};

export default botRes;
