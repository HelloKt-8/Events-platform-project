import axios from "axios";

const fetchUserProfile = async (uuid) => {
  try {
    const response = await axios.get(
      `https://xuxdrvauvgtomykhujkj.supabase.co/rest/v1/user_profiles?uuid=eq.${uuid}`,
      {
        headers: {
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eGRydmF1dmd0b215a2h1amtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0OTY4ODIsImV4cCI6MjA1MzA3Mjg4Mn0.wUtEfx7WqNxrxj24mmx_v8xq-1ZEyxg1ng_ZUe44JB0",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eGRydmF1dmd0b215a2h1amtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0OTY4ODIsImV4cCI6MjA1MzA3Mjg4Mn0.wUtEfx7WqNxrxj24mmx_v8xq-1ZEyxg1ng_ZUe44JB0`,
        },
      }
    );

    if (response.data.length === 0) {
      console.log("❌ No profile found for the given UUID. Creating new profile...");
      return null;
    }

    return response.data[0]; // Return the user profile object
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    return null;
  }
};

export { fetchUserProfile };
