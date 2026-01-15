import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import api from "../lib/axiosSetup";
import { Button } from "./ui/button";
import { Chrome } from "lucide-react";


const GoogleLoginbutton = ({onSuccess}) => {
  const googleAuth = (code) => api.get(`/api/auth/google?code=${code}`);
  const responseGoogleResult = async(authResult) => {
        try {
            if(authResult['code']){
              const response = await googleAuth(authResult['code']);
              const { user, accessToken } = response.data.data;
              onSuccess?.({ user, accessToken });
              localStorage.setItem('authToken', accessToken);
              window.location.href = '/home';
            }
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    }
    const googleLogin = useGoogleLogin({
    onSuccess: responseGoogleResult,
    onError: responseGoogleResult,
    flow: 'auth-code'
    });

  return (
    <Button
      onClick={() => googleLogin()}
      className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 shadow-lg
                 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600"
    >
      <Chrome className="mr-2" /> Continue With Google
    </Button>
  )
}

export default GoogleLoginbutton