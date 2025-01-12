import { GoogleOAuthProvider } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import { googleResponse } from "../lib/utils";

const GoogleLogin = () => {
  return (
    <div>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
      >
        <GoogleAuth />
      </GoogleOAuthProvider>
    </div>
  );
};
export default GoogleLogin;

const GoogleAuth = () => {
  const googleLogin = useGoogleLogin({
    onError: googleResponse,
    onSuccess: googleResponse,
    flow: "auth-code",
  });
  return (
    <div>
      <button
        onClick={googleLogin}
        className="border-slate-400 bg-slate-200 border-2 rounded-lg py-2 px-4"
      >
        {/* <img src={"/google.svg"} alt="google" width={30} height={30} /> */}
        Login with Google
      </button>
    </div>
  );
};
