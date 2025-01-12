import axios from "axios";
import { AuthResponse } from "./types";

export async function googleResponse(authResult: AuthResponse) {
  let isLogin;
  try {
    if (authResult && "code" in authResult) {
      const res = await axios.get(
        `http://localhost:3001/auth/google?code=${authResult.code}`,
        {
          withCredentials: true,
        }
      );
      isLogin = res.data.isLogin;
      console.log(isLogin);
    }
  } catch (error) {
    console.log("Error while requesting google code", error);
    // TODO: toast notification that something went wrong during login
    //   redirect("/");
  }
}
