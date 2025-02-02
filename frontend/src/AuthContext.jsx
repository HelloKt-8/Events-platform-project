import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const fetchUserProfile = async (uuid) => {
    try {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("uuid", uuid)
        .single(); 
      if (error) {
        throw error;
      }

      return profile; 
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      const authUser = session?.user || null;

      if (authUser) {
        const profile = await fetchUserProfile(authUser.id); 
        if (profile) {
          setUser({ ...authUser, ...profile }); 
        } else {
          console.error("User profile not found for:", authUser.id);
        }
      } else {
        setUser(null); 
      }

      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user || null;

        if (authUser) {
          const profile = await fetchUserProfile(authUser.id);
          if (profile) {
            setUser({ ...authUser, ...profile }); 
          } else {
            console.error("User profile not found for:", authUser.id);
          }
        } else {
          setUser(null); 
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
