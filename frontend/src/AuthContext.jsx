// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Assuming you've already initialized supabase

// Create a context for authentication
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // To store the user state
  const [loading, setLoading] = useState(true); // To handle loading state during auth

  // Check if the user is logged in when the app loads
  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

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
