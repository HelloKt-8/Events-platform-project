import React from "react";
import { supabase } from "../supabaseClient"; // Path to your Supabase client file

const SignUp = () => {
    const handleGoogleSignUp = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) {
            console.error("Error signing up with Google:", error.message);
        } else {
            console.log("Redirecting to Google sign-up...");
        }
    };

    return (
        <div className="signup-page">
            <h1>Sign Up for LondonLife</h1>
            <p>Create your account quickly and easily with Google.</p>
            <button onClick={handleGoogleSignUp}>
                Sign Up with Google
            </button>
        </div>
    );
};

export default SignUp;
