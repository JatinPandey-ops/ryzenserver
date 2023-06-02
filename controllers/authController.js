
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail
} from "firebase/auth";
import { createError } from "../error.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase.js";

export const login = async (req, res,next) => {
  try {
    const email = req.body.email;
    console.log(email)
    const password = req.body.password;
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const docSnap = await getDoc(doc(db,"users",user.uid))
    if(docSnap.exists()){
      res.status(200).json(docSnap.data());
    }else{
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName:null ,
        photoURL: user.photoURL,
        premium: false,
      });
    }
  } catch (error) {
 switch (error.code) {
  case "auth/user-not-found":
    next(createError(404,"User-not-found"))
    break;
    case "auth/wrong-password":
    next(createError(400,"Wrong-password"))
  default:
    break;
 }

  }
};
export const register = async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log(email)
    const name = req.body.name;
    const password = req.body.password;
    const country = req.body.country
    const currency = req.body.currency
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: name,
      photoURL: user.photoURL,
      premium: false,
      credit:20,
      country:country,
      currency:currency,
      subscriptionDays:0
    });
    await setDoc(doc(db, "conversations", user.uid), {
      messages: [
        {
          role: "system",
          content: `Follow the given Insructions-:
          1)Use emojis in conversation,
          2)If asked for introduction you will say "My name is Ryzen.I am an AI language model developed by Jatin to assit and communicate with users.It's nice to meet you!How can I assit you today?"
          3)You need to have a funny persoanlity,try to make every response funny.
          `,
        },]
      });
      const docSnap = await getDoc(doc(db,"users",user.uid))
      if(docSnap.exists()){
  
        res.status(200).json(docSnap.data());
      }else{
        next(400,"try again");
  
      }
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          next(createError(409,"email-already-in-use"));
          
          break;
      
        default : next(error)
          break;
      }
    }
};


export const forgetPassword = (req,res,next) => {
  const email = req.body.email


const auth = getAuth();
sendPasswordResetEmail(auth, email)
  .then(() => {
   res.status(200).json("password reset")
  })
  .catch((error) => {
    next(createError(500,"Something went wrong"))
    // ..
  });
}
