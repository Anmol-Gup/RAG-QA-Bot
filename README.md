# QA-BOT 🤖

A full-stack Question Answering Bot built with **Node.js/Express** (backend) and **React + Vite** (frontend).  
The bot can process documents and provide intelligent answers using RAG (Retrieval Augmented Generation).

---

## 📂 Project Structure
```
QA-BOT/
├── backend/ # Express.js server
│ ├── controllers/
│ ├── routes/
│ ├── utils/
│ ├── .env
| ├── .gitignore
│ ├── package.json
│ └── index.js
│
├── frontend/ # React + Vite app
│ ├── public/
│ ├── src/
│ ├── .env
| ├── .gitignore
│ ├── package.json
│ └── vite.config.js
│
├── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Anmol-Gup/RAG-QA-Bot.git
cd qa-bot
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a .env file inside backend/:
```bash
PINECONE_API_KEY = <your_pinecone_api_key>
PINECONE_INDEX = qa-bot-index
GEMINI_API_KEY= <your_gemini_api_key>
PORT = 3000
PINECONE_NAMESPACE = <your_pinecone_namespace_name>
```

Run the backend:
```bash
npm run dev
```
Backend runs on http://localhost:3000

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a .env file inside frontend/:
```bash
VITE_API_URL = http://localhost:3000/api
```

Run the frontend:
```bash
npm run dev
```
Frontend runs on http://localhost:5173

### ⚡ Features
- Upload documents (PDF/TXT/CSV)
- RAG-based Question Answering
- Node.js + Express backend
- React + Vite frontend
- Environment-based configuration

### 🛠️ Tech Stack
- Backend: Node.js, Express, MongoDB
- Frontend: React, Vite, Tailwind CSS
- AI: LangChain, Gemini