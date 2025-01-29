import React from "react";
import { supabase } from "../supabaseClient"; // Path to your Supabase client file

const Login = () => {
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) {
            console.error("Error logging in with Google:", error.message);
        } else {
            console.log("Redirecting to Google login...");
        }
    };

    return (
        <div className="login-page">
            <h1>Login to Your Account</h1>
            <button onClick={handleGoogleLogin}>
                Sign In with Google
            </button>
        </div>
    );
};

export default Login;
