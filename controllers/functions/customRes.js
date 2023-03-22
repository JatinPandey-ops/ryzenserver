import axios from "axios";

const customRes = async (psid) => {
try {
  
  await axios.post(
      `https://graph.facebook.com/v16.0/${process.env.FB_PAGE_ID}/messages?&access_token=${process.env.FB_VERIFY_TOKEN}`,
      {
        recipient: {
          id: `${psid}`,
        },
        messaging_type: "RESPONSE",
        message: {
          text: "My creator is Jatin!You can find his contact details in contact section of page",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
} catch (error) {
  console.log(error)
}
}

export default customRes