import React, { createContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { fetchUserProfile } from "../api calls/fetchUserProfiles";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;

      if (currentUser) {
        setUser(currentUser);

        let profile = await fetchUserProfile(currentUser.id);

        if (!profile) {

          const { data: existingProfile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("uuid", currentUser.id)
            .single();

          if (!existingProfile) {

            const { data, error } = await supabase
              .from("user_profiles")
              .insert([{ uuid: currentUser.id, email: currentUser.email, user_type: "user" }])
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
        setUserProfile(null);
      }
    };

    supabase.auth.onAuthStateChange(() => {
      fetchUserData();
    });

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, userProfile, setUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
