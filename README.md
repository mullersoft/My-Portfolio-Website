# 📌 Portfolio Website  

This is a **full-stack portfolio website** designed to showcase users, projects, and a contact form. The frontend is built with **React and TypeScript**, while the backend is developed using **NestJS and MongoDB**. The application is deployed with:  

- **Frontend** → [Netlify](https://aesthetic-stroopwafel-42b2f3.netlify.app/)  
- **Backend** → [Render](https://my-portfolio-website-z18d.onrender.com/)  
- **Database** → MongoDB Atlas  

## 🚀 Features  

### **Frontend**  
✅ Built with **React & TypeScript**  
✅ Fully **responsive** & **interactive** UI  
✅ Fetches data from the backend for:  
   - Users  
   - Projects  
   - Contact form submissions  
✅ Deployed on **Netlify**  

### **Backend**  
✅ Developed using **NestJS & TypeScript**  
✅ **MongoDB Atlas** for persistent data storage  
✅ Provides **RESTful APIs** for:  
   - CRUD operations on **users & projects**  
   - Contact message handling  
✅ Deployed on **Render**  

## 🛠️ Technologies Used  

### **Frontend (React & TypeScript)**  
- **ReactJS** for UI development  
- **TypeScript** for static typing  
- **Axios** for API communication  
- **React Router** for navigation  
- **Material UI** for styling  
- **Deployed on Netlify**  

### **Backend (NestJS & MongoDB)**  
- **NestJS** for backend architecture  
- **TypeScript** for robust typing  
- **MongoDB Atlas** for cloud database storage  
- **CORS** for secure cross-origin requests  
- **Deployed on Render**  

## 🏗️ Setup Instructions  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/mullersoft/My-Portfolio-Website.git
cd My-Portfolio-Website
```

### **2️⃣ Backend Configuration**  
Create a `.env` file inside the `server` directory and set up the following environment variables:  

```ini
# MongoDB connection string  
MONGO_URI=your_mongodb_uri  

# Server port  
PORT=5000  

# OpenAI API Key (if applicable)  
OPENAI_API_KEY=your_openai_api_key  

# Telegram Bot Credentials  
# Contact Bot (@mulersoftbot)  
BOT_TOKEN=your_bot_token  
CONTACT_BOT_CHAT_ID=your_chat_id  
CONTACT_WEBHOOK_URL=your_webhook_url  

# Quote Bot (@mullersoft_bot)  
TELEGRAM_BOT_TOKEN=your_bot_token  
QUOTE_BOT_CHAT_ID=your_chat_id  
QUOT_WEBHOOK_URL=your_webhook_url  

# Assessment Bot (@yourAssessmentBot)  
ASSESSMENT_BOT_TOKEN=your_bot_token  
ASSESSMENT_BOT_CHAT_ID=your_chat_id  
ASSESSMENT_WEBHOOK_URL=your_webhook_url  

# Auto Response Bot  
AUTORESPONSE_BOT_TOKEN=your_bot_token  
WEBHOOK_URL=your_webhook_url  
```

### **3️⃣ Frontend Configuration**  
Inside `client/src/services/apiService.ts`, update the API URL:  

```typescript
const API_URL = "https://my-portfolio-website-z18d.onrender.com";
```

### **4️⃣ Run the Application**  

#### **Start the Backend**  
```bash
cd server
npm install
npm run dev:start
```

#### **Start the Frontend**  
```bash
cd client
npm install
npm start
```

## 🎯 Deployment Links  

🔗 **Frontend**: [Live Website](https://aesthetic-stroopwafel-42b2f3.netlify.app/)  
🔗 **Backend API**: [API Endpoint](https://my-portfolio-website-z18d.onrender.com/)  
