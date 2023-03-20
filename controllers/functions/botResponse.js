import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { v4 as uuid } from "uuid";
import { db } from "../../firebase.js";
import sendtext from "./sendText.js";

const botRes = async (res, text, psid) => {
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
    res.status(200).json("Received webhook");
  } else {
    await setDoc(doc(db, "conversations", `${psid}@facebook.com`), {
      messages: [
        {
          role: "system",
          content: `You role is of a helpful and sarcastic friend,use emojis in conversation and if asked for introduction you will say "My name is Ryzen.I am an AI language model developed by Jatin to assit and communicate with users.It's nice to meet you!How can I assit you today?".`,
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
    res.status(200).json("Received");
  }
};

export default botRes;
