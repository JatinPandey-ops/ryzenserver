import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { createError } from "../error.js";


export const updateDetails = async (req, res) => {
  const { uid, ...body } = req.body;
  // console.log(body)
  // console.log(body)
  // console.log(uid)
    try {
      await updateDoc(doc(db,"users", uid),body)
      res.status(200).json("Updated");
    } catch {
      (error) => {
        console.log(error)
      };
    }
  };
  
 