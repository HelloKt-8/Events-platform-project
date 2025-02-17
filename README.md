# Events Platform Project  

📍 **Hosted Website:** [Events Platform](https://events-platform-project-8hptujha4-katies-projects-4122f895.vercel.app/)  

## 📌 Project Summary  
Welcome! This web application allows users to **sign in through Google Authentication** to browse a list of events. Depending on your **user type (Admin/Member/Guest)**, you will have different permissions.  

### 🔹 User Roles & Permissions:  
- **Guest (Not Logged In):** You can browse events but need to sign in to join.  
- **Member:** You can **view & join events** after logging in.  
- **Staff Member (Admin):** You can **create, modify (edit/delete), and join events**.  

### 📅 Google Calendar Integration  
When a user joins an event, they will be redirected to their **Google Calendar** where they can view the event details.  
⚠️ **Note:** Make sure your Google Calendar is set to the **same month as the event** to see it correctly!  

🎥 **Video Demonstration:** [Watch Here](https://youtu.be/WgHaYnk3v1Y)  

---

## 🛠 How to Run the Project Locally  

Follow these steps to set up the project on your local machine.  

### 🔹 **Backend Setup (Node.js & Express)**  
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/HelloKt-8/Events-platform-project.git
   cd Events-platform-project

2. **Navigate to the backend folder:**
   ```bash 
   cd backend 

3. **Install dependencies:**
   ```bash 
   npm install

4. **Set up environment variables:**
   **For development (`.env.development`):**  
   ```env
   PGDATABASE=events_platform_db

5. **Start the backened server:**
   **For local development setup:**
   ```bash
   npm run setup-dbs
   npm run seed
   npm run dev

### 🔹 **Frontend Setup (React and Vite)**  
1. **Navigate to the frontend folder:**  
   ```bash
   cd frontend

2. **Install dependencies:**
   ```bash 
   npm install

3. **Start the development server:**  
   ```bash
   npm run dev

4. **Open app in browswer:**
  Vite will show a URL like this: 
   "Local: http://localhost:5173/

## 🔑 Login Credentials  

If you want to test different user roles, use the credentials below:  

### **👤 Member Login**  
- **Email:** `tt2350592@gmail.com`  
- **Password:** `Developer123`  

### **🛠 Admin (Staff) Login**  
- **Email:** `devel6842@gmail.com`  
- **Password:** `Developer123!`  

📌 *Guests can browse events but must sign in to join.*  

---

## 💻 Technologies Used  

### 🔹 **Backend (Node.js & Express.js)**  
- Node.js  
- Express.js  
- PostgreSQL (Database)  
- Supabase (Authentication & Data Management)  
- CORS Middleware  

### 🔹 **Frontend (React & Vite)**  
- React.js  
- Vite  
- React Router  
- Axios  
- Google Calendar API  
- Supabase Authentication  

### 🔹 **Deployment & Hosting**  
- **Render** → Backend Hosting  
- **Vercel** → Frontend Deployment  
- **Google Cloud Console** → OAuth & API Management  

---

## ❓ Need Help?  
If you run into any issues, feel free to contact me:  
📧 **Email:** [katieluc8@gmail.com](mailto:katieluc8@gmail.com)  

