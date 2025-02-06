import React, { createContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { fetchUserProfile } from "../api calls/fetchUserProfiles";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [session, setUserSession] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData?.session;
      if (currentSession) {
        setUserSession(currentSession); 
        setUser(currentSession.user);

        let profile = await fetchUserProfile(currentSession.user.id);
        if (!profile) {
          const { data: existingProfile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("uuid", currentSession.user.id)
            .single();

          if (!existingProfile) {
            const { data, error } = await supabase
              .from("user_profiles")
              .insert([
                { uuid: currentSession.user.id, email: currentSession.user.email, user_type: "user" },
              ])
              .select()
              .single();

            if (error) {
              console.error(error);
            } else {
              setUserProfile(data);
            }
          } else {
            setUserProfile(existingProfile);
          }
        } else {
          setUserProfile(profile);
        }
      } else {
        setUser(null);
        setUserSession(null);
        setUserProfile(null);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUserData();
    });

    fetchUserData();

    return () => {
      listener?.subscription?.unsubscribe(); 
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, userProfile, setUserProfile, session }}>
      {children}
    </UserContext.Provider>
  );
};
