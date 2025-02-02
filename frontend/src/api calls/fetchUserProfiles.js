import axios from "axios";

const fetchUserProfile = async () => {
  try {
    const response = await fetch(
      "https://xuxdrvauvgtomykhujkj.supabase.co/rest/v1/user_profiles?user_id=2",
      {
        headers: {
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eGRydmF1dmd0b215a2h1amtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0OTY4ODIsImV4cCI6MjA1MzA3Mjg4Mn0.wUtEfx7WqNxrxj24mmx_v8xq-1ZEyxg1ng_ZUe44JB0",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eGRydmF1dmd0b215a2h1amtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0OTY4ODIsImV4cCI6MjA1MzA3Mjg4Mn0.wUtEfx7WqNxrxj24mmx_v8xq-1ZEyxg1ng_ZUe44JB0`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      console.log("No data found for the given user_id.");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

export {fetchUserProfile}
