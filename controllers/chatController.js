import { Configuration, OpenAIApi } from "openai"
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { v4 as uuid }  from "uuid";
import {db} from "../firebase.js"


export const result = async (req,res) => {
try {
  const uid = req.body.uid
  const jsonStr = JSON.stringify(req.body)
  const jsonObj = JSON.parse(jsonStr)
  const data = {
    uid: uuid(),
    role : jsonObj.role,
    content : jsonObj.content
  }
  await updateDoc(doc(db, "conversations", uid), {
    
    messages: arrayUnion(data)
  });
  
  const docRef = doc(db, "conversations", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const messageArr = docSnap.data().messages
    const message = messageArr.map(({uid,...others}) => others)
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
      uid: uuid(),
      role: response.role,
      content: response.content
    }
    await updateDoc(doc(db, "conversations", uid), {
  
      messages: arrayUnion(resData)
    });
    res.json(response);

  } else {
    console.log("No such document!");
  }
   
} catch (error) {
    console.log(error)
}

}