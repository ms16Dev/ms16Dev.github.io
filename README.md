# Portfolio Management App

A full-stack portfolio management application built with Google Antigravity, hosted with github pages, Fly.io & Aiven MySQL.

Vist app here [https://ms16dev.github.io](https://ms16dev.github.io)

## 🚀 Technologies

### Frontend
- **Core:** React 18, Vite
- **Styling:** TailwindCSS v4
- **Animations & 3D:** GSAP, Three.js, Vanta.js
- **State & Logic:** React Router v7, React Hook Form, Zod (Validation), Axios

### Backend
- **Framework:** FastAPI
- **Database:** SQLModel (SQLAlchemy + Pydantic)
- **Authentication:** JWT (OAuth2 with Password Bearer)
- **Infrastructure:** Fly.io configuration

## 📂 Project Structure

```
portfolio-app/
├── backend/                # FastAPI Application
│   ├── routers/            # API Endpoints (Auth, Projects, etc.)
│   ├── models.py           # Database Models
│   ├── main.py             # Entry point
│   └── ...
├── frontend/               # React Application
│   ├── src/                # Components, Pages, Hooks
│   ├── public/             
│   └── ...
└── ...
```

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)

### 1. Backend Setup

The backend serves the API and handles database operations.

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# Windows:
.\.venv\Scripts\Activate.ps1


# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 127.0.0.1 --port 9000
```
_The API will be available at `http://127.0.0.1:9000`. API Docs at `/docs`._

### 2. Frontend Setup

The frontend is a Vite-powered React app. 

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev -- --port 3000
```
_The application will be accessible at `http://localhost:3000`._

## 🌍 Deployment

### Backend (Fly.io)

1. **Install Fly CLI:** Follow instructions at [fly.io](https://fly.io/docs/hands-on/install-flyctl/).
2. **Login:** `fly auth login`
3. **Launch:** Run `fly launch` in the `backend` directory.
4. **Set Secrets:** Set the required environment variables.
   ```bash
   fly secrets set DATABASE_URL="<your_db_url>" \
       JWT_SECRET="<your_secret>" \
       JWT_ALGORITHM="HS256" \
       ACCESS_TOKEN_EXPIRE_MINUTES="60" \
       ADMIN_USERNAME="<your_admin_username>" \
       ADMIN_PASSWORD="<your_admin_password>"
   ```
5. **Deploy:** `fly deploy`

### Frontend (GitHub Pages)

1. **Rename your repo to your github user name**


2. **Navigate to Frontend:** `cd frontend`
3. **Build Project:** Generate the production build.
   ```bash
   npm run build
   ```
4. **Move Artifacts:** Copy the contents of the `dist` folder to the repository root.
   ```bash
   # Windows (PowerShell)
   Copy-Item -Path dist\* -Destination ..\ -Recurse -Force

   # macOS/Linux
   cp -r dist/* ../
   ```
5. **Push to GitHub:** Commit and push the changes to your repository to trigger the GitHub Pages deployment.

## ✨ Key Features

- **Dynamic Content Management:** Admin dashboard to manage Projects, Resume, About info, and Calendar events.
- **Secure Authentication:** JWT-based login for admin access.
- **Vibrant UI:** Custom animations and links using GSAP and Three.js.
- **Responsive Design:** Fully optimized experience across desktop and mobile devices.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
