import { Configuration, OpenAIApi } from "openai";
import {
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid }  from "uuid";
import { db } from "../../firebase.js";

const response = async (uid,data,docSnap,res) => {
    try {
        const messageArr = docSnap.data().messages;
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
        res.status(200).json(resData)
        await updateDoc(doc(db, "conversations", uid), {
          messages: arrayUnion(resData),
        });
    } catch (error) {
      res.status(500).json(
        {
          uid: uuid(),
          role : "assistant",
          content : "My server is down!Stay tuned"
        }
      )
    }
};

export default response;
