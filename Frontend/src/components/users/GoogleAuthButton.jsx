import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../../lib/axiosSetup";
import { Button } from "../ui/button";
import { Chrome } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/userSlice";

const GoogleLoginbutton = ({ onSuccess, isLoading, setIsLoading }) => {
  const dispatch = useDispatch();

  const googleAuth = (code) => api.get(`/api/auth/google?code=${code}`);
  const responseGoogleResult = async (authResult) => {
    try {
      if (authResult["code"]) {
        const response = await googleAuth(authResult["code"]);
        const { user, accessToken } = response.data.data;
        onSuccess?.({ user, accessToken });
        if (!accessToken || !user) {
          console.error("Access token missing!");
          return;
        }
        localStorage.setItem("accessToken", accessToken);
        dispatch(setUser(user));
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const responseGoogleError = () => {
    setIsLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogleResult,
    onError: responseGoogleError,
    flow: "auth-code",
  });

  return (
    <Button
      disabled={isLoading}
      onClick={() => {
        (setIsLoading(true), googleLogin());
      }}
      className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 shadow-lg
                 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600"
    >
      <Chrome className="mr-2" />{" "}
      {isLoading ? "Signing..." : "Continue With Google"}
    </Button>
  );
};

export default GoogleLoginbutton;
