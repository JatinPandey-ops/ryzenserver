import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase.js";

export const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
           const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;
            res.status(200).json(user)
      } catch (error) {
        console.log(error);
      }
};
export const register = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
       const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        res.status(200).json(user)
    await setDoc(doc(db, "users", user.uid), {
        email : user.email,
        emailVerified: user.emailVerified,
        displayName : user.displayName,
        photoURL : user.photoURL,
        premium : false
      });
    await setDoc(doc(db, "conversations", user.uid), {
      messages: [
        {role: "system", content: "You are a helpful assistant."},
        {role: "user", content: "Your name is Ryzen."},
    ],
      });
  } catch (error) {
    console.log(error);
  }
};
