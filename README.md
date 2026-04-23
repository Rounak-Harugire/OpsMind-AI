# ✦ OpsMind AI: Intelligent RAG-Powered Document Assistant 🚀

OpsMind AI is a premium, full-stack Enterprise Intelligence platform that transforms static organizational knowledge into an interactive, context-aware digital assistant. Leveraging **Retrieval-Augmented Generation (RAG)**, it enables users to query complex PDF documents and receive accurate answers backed by verifiable source citations.

Developed by **Rounak Harugire** | Final Year B.Tech (AI & ML) | D.K.T.E Society's Textile & Engineering Institute

---

## 🧠 The RAG Architecture
OpsMind AI utilizes a state-of-the-art data pipeline to eliminate AI hallucinations and ensure data grounding:

1. **Intelligent Ingestion:** Raw PDF data is parsed using \pdf-parse\ and cleaned for processing.
2. **Recursive Character Chunking:** Text is split into overlapping segments to maintain semantic context across boundaries.
3. **High-Dimensional Embedding:** Chunks are processed via Google's \	ext-embedding-001\ model, creating 768-dimensional vectors.
4. **Vector Database:** Embeddings are stored in **MongoDB Atlas Vector Search**, utilizing an **HNSW (Hierarchical Navigable Small World)** index for sub-second similarity searches.
5. **Contextual Synthesis:** Relevant chunks are retrieved and injected into a specialized prompt for **Gemini 1.5 Flash**, producing answers with exact page and filename references.

---

## ✨ Premium Feature Set

### 🖥️ High-End UI/UX
- **Glassmorphic Design:** A modern, centered Landing Page with backdrop-blur effects and gradient accents.
- **Unified Auth Flow:** A sleek, centered Authentication system (Login/Signup) with real-time validation.
- **Floating Command Center:** A ChatGPT-inspired chatbox with auto-expanding textareas and integrated file upload badges.

### ⚙️ Core Functionality
- **Real-Time Streaming (SSE):** Experience "thinking" in real-time with letter-by-letter response streaming.
- **Deep Analysis Mode:** Visual pulsing progress indicators that distinguish between vector retrieval and AI synthesis.
- **Document Persistence:** Securely manage uploaded documents with automated metadata extraction.
- **Enterprise Security:** Industry-standard JWT (JSON Web Tokens) for session management and Bcrypt for sensitive data encryption.

---

## 🛠️ Tech Stack & Prerequisites

### **Tech Stack**
- **Frontend:** React 18 (Vite), Tailwind CSS v4, Axios, Lucide Icons, React Markdown.
- **Backend:** Node.js, Express.js, Multer (File Handling), PDF-Parse.
- **AI Engine:** Google Generative AI (Gemini 1.5 Flash), Google Embeddings.
- **Database:** MongoDB Atlas (NoSQL + Vector Search).
- **Infrastructure:** Docker, Docker Compose.

---

## ⚙️ Installation & Deployment

### 1. Environment Configuration
Create a \.env\ file in the \ackend/\ directory with the following variables:
\\\env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/opsmind
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_signing_secret
\\\

### 2. Manual Development Setup
\\\ash
# Terminal 1: Start the Backend
cd backend
npm install
npm run dev

# Terminal 2: Start the Frontend
cd frontend
npm install
npm run dev
\\\

### 3. Docker Deployment (Standardized)
Run the entire ecosystem with a single command:
\\\ash
docker-compose up --build
\\\

---

## 📂 Project Structure
\\\	ext
opsmind-ai/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers for Auth, Chat, and Files
│   │   ├── models/        # Mongoose Schemas (User, DocumentChunks)
│   │   ├── services/      # Gemini AI & MongoDB Vector Logic
│   │   └── server.js      # API Entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # Landing, Auth, ChatArea, Sidebar
│   │   ├── App.jsx        # View-state management
│   │   └── index.css      # Tailwind v4 globals & custom animations
│   └── Dockerfile
└── docker-compose.yml     # Container orchestration
\\\

---

## 🤝 Support & Contribution
This project was built as a demonstration of modern AI integration in enterprise workflows. 

Built with ❤️ by Rounak Harugire.
