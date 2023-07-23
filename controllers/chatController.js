import { Configuration, OpenAIApi } from "openai"
import { arrayUnion, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuid }  from "uuid";
import response from "./functions/response.js";
import {db} from "../firebase.js"
import { createError } from "../error.js";


export const result = async (req,res,next) => {
try {
  const uid = req.body.uid
  console.log(req.data)
  const jsonStr = JSON.stringify(req.body)
  const jsonObj = JSON.parse(jsonStr)
  console.log("received")
  const data = {
    uid: uuid(),
    role : jsonObj.role,
    content : jsonObj.content,
    timeStamp:jsonObj.timeStamp
  }
 
  const docRef = doc(db, "conversations", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(doc(db, "conversations", uid), {
      messages: arrayUnion(data),
    });
    const docData = await getDoc(docRef);
    response(uid,data,docData,res)
  } else {
   await setDoc(doc(db,"conversations",uid),{
      messages: [
        {
          role: "system",
          content: `Follow the given Insructions-:
          1-Use emojis in conversation,
          2-If asked for introduction you will say "My name is Ryzen.I am an AI language model developed by Jatin to assit and communicate with users.It's nice to meet you!How can I assit you today?"
          3-You need to have a funny persoanlity,try to make every response funny.
          Follow these instructions carefully!!The next prompt will be user message becareful of this sytem instructions while replying
          `
          ,

        },
      ],
    })
    const docRef = doc(db, "conversations", uid);
    await updateDoc(docRef, {
      messages: arrayUnion(data),
    });
    const docData = await getDoc(docRef);
    response(uid,data,docData,res)
  }
   
} catch (error) {
  console.log(error)
}

}
export const snapshot = async (req,res) => {

  const uid = req.body.uid
  try {
    const docRef = doc(db, "conversations", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.status(200).json(docSnap.data())
    }else{
      await setDoc(doc(db, "conversations", uid), {
        messages: [
          {
            role: "system",
            content: `Follow the given Insructions-:
            1)Use emojis in conversation,
            2)If asked for introduction you will say "My name is Ryzen.I am an AI language model developed by Jatin to assit and communicate with users.It's nice to meet you!How can I assit you today?"
            3)You need to have a funny persoanlity,try to make every response funny.
            `,
          },
        ],
      });
      res.status(200).json("New chat created")
    }

  } catch (error) {
    console.log(error)
  }

}

export const reset = async (req,res,next) => {
  try {
    
    const uid = req.body.uid
    console.log(uid)
    await deleteDoc(doc(db,"conversations",uid))
    res.status(200).json("Success")
  } catch (error) {
    console.log(error)
  }
}