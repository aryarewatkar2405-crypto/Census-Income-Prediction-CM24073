# Phase 3: React Frontend Dashboard — Census Income Prediction

Welcome to **Phase 3** of the Census Income Prediction project!

This folder contains the **React single-page dashboard** built with Vite that provides an interactive, beautiful interface for predicting census income and visualizing ML model performance.

---

## 📌 Architecture Overview

```text
React Frontend (Vite on port 5173)
       │
       ▼ (HTTP REST Requests)
FastAPI Backend (port 8000)
       │
       ▼ (Passes 14 raw features)
census_income_model.pkl (Scikit-Learn Pipeline)
       │
       ▼ (Random Forest inference)
Classification & Confidence Probabilities
       │
       ▼ (JSON Response)
Interactive Visualization & Prediction Card
```

---

## 🛠️ Technologies Used

- **React 19**: Modern component-based UI framework.
- **Vite 6**: Next-generation fast frontend tooling and dev server.
- **Lucide-React**: Clean, lightweight icons for dashboards.
- **Vanilla CSS3**: Tailored glassmorphism design system with dark mode aesthetics.
- **Fetch API**: Native browser HTTP client communicating with FastAPI.

---

## 📁 Frontend Structure

```text
frontend/
├── index.html               # Main HTML template with Google Fonts (Outfit & Inter)
├── package.json             # React, Vite, and Lucide dependencies
├── vite.config.js           # Vite dev server configuration (port 5173)
├── .env.example             # Example environment variables
├── .env                     # Local environment settings (VITE_API_URL)
├── README.md                # Frontend documentation (this file)
│
└── src/
    ├── main.jsx             # React DOM entry point
    ├── App.jsx              # Main App wrapper with auto-health polling
    ├── index.css            # Custom glassmorphic CSS design system
    │
    ├── services/
    │   └── api.js           # REST API client (getHealth, getMetrics, predictIncome)
    │
    ├── data/
    │   └── featureOptions.js # Categorical dropdown lists and quick presets
    │
    ├── components/
    │   ├── Navbar.jsx       # Header with live backend connection indicator
    │   ├── MetricCard.jsx   # KPI metric cards (Accuracy, Precision, Recall, F1)
    │   ├── PredictionForm.jsx # 4-tab 14-feature input form with 1-click presets
    │   ├── PredictionResult.jsx # Classification card with confidence bar meters
    │   ├── ModelPerformance.jsx # Visual Confusion Matrix & Model Comparison
    │   └── DatasetInfoSection.jsx # Dataset metadata & feature descriptions
    │
    └── pages/
        └── Dashboard.jsx    # Complete assembled dashboard
```

---

## ⚙️ Installation & Running the Dashboard

### 1. Install Dependencies
Open your terminal in `c:\Project\Census-Income-Prediction\frontend`:

```powershell
cd c:\Project\Census-Income-Prediction\frontend
npm install
```

### 2. Make Sure the FastAPI Backend is Running
Open a second terminal window and start the backend on port 8000:

```powershell
cd c:\Project\Census-Income-Prediction
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### 3. Start the Frontend Development Server
In your first terminal window, start the React frontend:

```powershell
npm run dev
```

The terminal will display:
```text
  VITE v6.1.0  ready in 150 ms

  ➜  Local:   http://127.0.0.1:5173/
  ➜  Network: use --host to expose
```

### 4. Open in Your Browser
Navigate to 👉 **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)**

---

## 🎯 How to Make a Prediction

1. Open `http://127.0.0.1:5173/`.
2. Click one of the **Quick Presets** at the top of the form (e.g. *"High Income (>50K Expected)"* or *"Standard Income (<=50K Expected)"*) or manually enter individual attributes.
3. Click **"Predict Income Category"**.
4. View the resulting classification badge (`>50K` or `<=50K`) and the exact probability meters calculated by the Random Forest model.

---

## 🔍 Troubleshooting & Common Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"Backend Offline" badge is shown** | FastAPI server is not running on port 8000. | Run `python -m uvicorn backend.main:app --port 8000` in the backend directory. |
| **CORS Error in Browser Console** | Backend does not allow port 5173. | `backend/main.py` is already configured with `http://localhost:5173` and `http://127.0.0.1:5173`. Ensure backend is running the latest `main.py`. |
| **Port 5173 is in use** | Another Vite process is running. | Vite will automatically switch to port 5174. |
