// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; // Assuming you've already initialized supabase

// Create a context for authentication
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // To store the user state
  const [loading, setLoading] = useState(true); // To handle loading state during auth

  // Function to fetch the user profile using UUID
  const fetchUserProfile = async (uuid) => {
    try {
      const { data: profiles, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("uuid", uuid)
        .single(); // Assuming one user profile per UUID

      if (error) {
        throw error;
      }

      if (profiles) {
        console.log("Fetched user profile:", profiles);
        setUser((prevUser) => ({
          ...prevUser,
          user_id: profiles.user_id,
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  // Fetch session on app load and listen for auth changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      const user = session?.user || null;

      if (user) {
        setUser(user);
        await fetchUserProfile(user.id); // Fetch user profile on login
      }

      setLoading(false);
    };

    fetchSession();

    // Listen for auth state changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user || null;
        setUser(user);

        if (user) {
          fetchUserProfile(user.id); // Fetch user profile on login
        } else {
          setUser(null); // Set to null when the user logs out
        }
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
