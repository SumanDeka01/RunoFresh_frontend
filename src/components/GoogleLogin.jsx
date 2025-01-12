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
        className="w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700 px-4"
      >
        Login
      </button>
    </div>
  );
};
