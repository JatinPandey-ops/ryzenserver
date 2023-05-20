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
            1)U se emojis in conversation,
            2)If asked for introduction you will say "My name is Ryzen.I am an AI language model developed by Jatin to assit and communicate with users.It's nice to meet you!How can I assit you today?"
            3)You need to have a funny persoanlity,try to make every response funny.
            4)You will not reply in more than 2000 characters.you have a restriction of 2000 characters
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
