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
        console.log("✅ User is logged in:", currentUser);

        // Fetch user profile using UUID
        let profile = await fetchUserProfile(currentUser.id);

        if (!profile) {
          console.log("⚡ No profile found. Checking before inserting...");

          // Check again to avoid duplicates
          const { data: existingProfile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("uuid", currentUser.id)
            .single();

          if (!existingProfile) {
            console.log("⚡ Inserting new user profile...");

            const { data, error } = await supabase
              .from("user_profiles")
              .insert([{ uuid: currentUser.id, email: currentUser.email, user_type: "user" }])
              .select()
              .single();

            if (error) {
              console.error("❌ Error creating user profile:", error);
            } else {
              console.log("✅ New user profile created:", data);
              setUserProfile(data);
            }
          } else {
            console.log("🔍 Profile already exists, no need to insert.");
            setUserProfile(existingProfile);
          }
        } else {
          setUserProfile(profile);
        }
      } else {
        console.log("No active user session found.");
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
