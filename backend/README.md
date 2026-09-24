# Phase 2: FastAPI Backend — Census Income Prediction

Welcome to **Phase 2** of the Census Income Prediction project!

This folder contains the **FastAPI REST API** that serves real-time machine learning predictions from the trained Random Forest model created in Phase 1.

---

## 📌 Architecture Overview

```text
React Frontend (Phase 3)
       │
       ▼ (HTTP JSON Requests)
FastAPI Backend (Phase 2)
       │
       ▼ (Passes raw 14 features into pipeline)
census_income_model.pkl (Phase 1 Model)
       │
       ▼ (Preprocessing + Random Forest inference)
Prediction & Probabilities
       │
       ▼ (HTTP JSON Responses)
React Dashboard Display
```

> **Note**: The backend **never retrains** the model. It loads the pre-trained `census_income_model.pkl` pipeline once when the server starts and serves predictions with sub-second latency.

---

## 📁 Backend Folder Structure

```text
backend/
├── main.py                  # FastAPI application, endpoints & validation
├── requirements.txt          # Pinned backend dependencies
├── README.md                 # Beginner-friendly guide (this file)
└── model/
    ├── census_income_model.pkl  # Trained ML pipeline (from Phase 1)
    ├── model_metrics.json       # Real evaluation metrics & confusion matrix
    └── dataset_info.json        # Schema & feature definitions
```

---

## ⚙️ Installation & Setup

1. Open your terminal in the root project folder:
   ```powershell
   cd c:\Project\Census-Income-Prediction
   ```

2. (Optional) Activate your Python virtual environment if you use one.

3. Verify dependencies are installed:
   ```powershell
   python -m pip install -r backend/requirements.txt
   ```

---

## 🚀 How to Start the Backend Server

Run the server with Uvicorn:

```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Output in terminal:
```text
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     census-api - Successfully loaded model from backend\model\census_income_model.pkl
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root endpoint displaying API status and links. |
| `GET` | `/health` | Health check verifying the model is loaded. |
| `GET` | `/metrics` | Returns actual model accuracy, F1-score, and confusion matrix. |
| `GET` | `/dataset-info` | Returns feature schema for the frontend. |
| `POST` | `/predict` | Main endpoint that accepts 14 raw features and returns predictions. |
| `GET` | `/docs` | Interactive Swagger UI documentation. |

---

## 📖 Interactive Swagger Documentation

FastAPI automatically generates an interactive documentation page. 

Open your browser and navigate to:
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

From this page, you can test every endpoint directly by clicking **"Try it out"** and **"Execute"**.

---

## 🧪 Testing the Prediction Endpoint

### Example 1: `POST /predict` Request (Predicting `<=50K`)

```json
{
  "age": 38,
  "workclass": "Private",
  "fnlwgt": 89814,
  "education": "HS-grad",
  "education-num": 9,
  "marital-status": "Married-civ-spouse",
  "occupation": "Farming-fishing",
  "relationship": "Husband",
  "race": "White",
  "sex": "Male",
  "capital-gain": 0.0,
  "capital-loss": 0.0,
  "hours-per-week": 50.0,
  "native-country": "United-States"
}
```

#### Example Response:
```json
{
  "prediction": "<=50K",
  "probabilities": {
    "<=50K": 0.94,
    ">50K": 0.06
  },
  "model_name": "Random Forest Classifier"
}
```

---

### Example 2: `POST /predict` Request (Predicting `>50K`)

```json
{
  "age": 45,
  "workclass": "Private",
  "fnlwgt": 180000,
  "education": "Bachelors",
  "education-num": 13,
  "marital-status": "Married-civ-spouse",
  "occupation": "Exec-managerial",
  "relationship": "Husband",
  "race": "White",
  "sex": "Male",
  "capital-gain": 15000.0,
  "capital-loss": 0.0,
  "hours-per-week": 55.0,
  "native-country": "United-States"
}
```

#### Example Response:
```json
{
  "prediction": ">50K",
  "probabilities": {
    "<=50K": 0.08,
    ">50K": 0.92
  },
  "model_name": "Random Forest Classifier"
}
```

---

## 🔒 CORS Configuration

CORS (Cross-Origin Resource Sharing) is configured to allow requests from the React frontend development servers:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

---

## 🔗 Preparation for Phase 3 (React Dashboard)

In **Phase 3**, the React frontend will:
1. Call `GET /metrics` on page load to display model accuracy, charts, and confusion matrix.
2. Call `GET /dataset-info` to dynamically populate dropdown choices.
3. Call `POST /predict` when the user clicks "Predict Income" and display the resulting classification card with confidence bars.
