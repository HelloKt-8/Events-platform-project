# Events-platform-project

Hosted website: https://events-platform-project-8hptujha4-katies-projects-4122f895.vercel.app/

## Project Summary
Welcome! This web application allows users to sign in through Google Authentication to browse a list of events. Depending on your user type (admin/member), you will be presented with different permissions. 

- **User**: You can view and join events upon logging in.
- **Staff Member**: You can create, modify (edit/delete), and join events.

Once a user decides to join an event, they will be redirected to their Google Calendar where they can view the event they wish to attend.

Please see video demostration here: 


## To run the project locally: 
Please view the below instructions on how to run this project locally. 
1. Have the following installed:
   - Node.js
   - npm
2. Clone the repository (https://github.com/HelloKt-8/Events-platform-project)
3. Install dependencies:
   - npm install
4. In the frontend directory, create a .env.local file to set up the environment variables:
   VITE_GOOGLE_CLIENT_ID='your-client-id'(obtain from Google Cloud Console)
   VITE_GOOGLE_API_KEY='google-api-key' (obtain from Google Cloud Console)
5. In the terminal, run the project locally by typing:
   - npm run dev
6. Open the web app on local host.

## Login Details
Non a member: You can still browse a list of events but you will need to sign up to join any. 
- **Member**:
  - Email: `tt2350592@gmail.com`
  - Password: `Developer123`
- **Admin**:
  - Email: `devel6842@gmail.com`
  - Password: `Developer123!`

## Technologies used: 
### Backend (Node.js & Express): 
- Node.js
- Express.js
- PostgreSQL
- Supabase
- CORS Middleware

### Frontend (React):
- React
- Vite
- React Router
- Axios
- Google Calendar API
- Supabase Authentication

### Deployment & Hosting: 
- Render (Backend host)
- Vercel (Frontend deploy)
- Google Cloud Console (Managing OAuth & API keys)

If you run into any issues, please contact me at katieluc8@gmail.com and I will be happy to assist!
