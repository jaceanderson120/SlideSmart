import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

const sendForgotPasswordEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

export default sendForgotPasswordEmail;
