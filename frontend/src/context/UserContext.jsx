import React, { createContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { fetchUserProfile } from "../api calls/fetchUserProfiles";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Get current session from Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;

      if (currentUser) {
        setUser(currentUser);
        console.log("User is logged in:", currentUser);

        // Fetch user profile using the UUID
        const profile = await fetchUserProfile(currentUser.id);
        if (profile) {
          setUserProfile(profile);
          console.log("User Profile:", profile);
        }
      } else {
        console.log("No active user session found.");
        setUser(null);
        setUserProfile(null);
      }
    };

    // Listen for auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id).then(setUserProfile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    fetchUserData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, userProfile, setUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
