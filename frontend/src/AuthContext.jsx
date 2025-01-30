import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Combined auth + profile state
  const [loading, setLoading] = useState(true); // To handle loading state

  // Function to fetch the user profile using UUID
  const fetchUserProfile = async (uuid) => {
    try {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("uuid", uuid)
        .single(); // Fetch profile by UUID

      if (error) {
        throw error;
      }

      return profile; // Return the fetched profile
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      return null;
    }
  };

  // Fetch session and combine auth + profile data
  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      const authUser = session?.user || null;

      if (authUser) {
        const profile = await fetchUserProfile(authUser.id); // Fetch profile by UUID
        if (profile) {
          setUser({ ...authUser, ...profile }); // Merge auth user with profile
        } else {
          console.error("User profile not found for:", authUser.id);
        }
      } else {
        setUser(null); // Clear user state on logout
      }

      setLoading(false);
    };

    fetchSession();

    // Listen for auth state changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user || null;

        if (authUser) {
          const profile = await fetchUserProfile(authUser.id);
          if (profile) {
            setUser({ ...authUser, ...profile }); // Merge auth user with profile
          } else {
            console.error("User profile not found for:", authUser.id);
          }
        } else {
          setUser(null); // Clear user state on logout
        }
      }
    );

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

export const useAuth = () => {
  return useContext(AuthContext);
};
