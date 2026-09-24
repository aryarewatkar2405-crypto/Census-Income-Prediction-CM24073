# Phase 1: Model Training — Census Income Prediction

Welcome to **Phase 1** of the Census Income Prediction project!

This folder contains all the code, models, and metadata for training, evaluating, and exporting the machine learning model.

---

## 📌 Project Overview

- **Objective**: Predict whether an individual earns more than **$50,000 per year** (`>50K`) or **$50,000 or less** (`<=50K`) based on demographic and employment attributes.
- **Problem Type**: Supervised Binary Classification.
- **Dataset**: Adult / Census Income Dataset (48,842 records, 14 input features, 1 target column).

---

## 📊 Dataset & Features

The model uses **14 features** to make predictions:

### 1. Numerical Features (6)
- `age`: Age of the individual in years.
- `fnlwgt`: Final sampling weight assigned by the US Census Bureau.
- `education-num`: Educational attainment represented as a continuous number (e.g., 9 for High School, 13 for Bachelors).
- `capital-gain`: Capital investment gains recorded.
- `capital-loss`: Capital investment losses recorded.
- `hours-per-week`: Working hours per week.

### 2. Categorical Features (8)
- `workclass`: Employment sector (e.g., *Private*, *Self-emp-not-inc*, *Local-gov*, *Federal-gov*).
- `education`: Highest education level completed (e.g., *Bachelors*, *HS-grad*, *Masters*, *Doctorate*).
- `marital-status`: Marital status (e.g., *Married-civ-spouse*, *Never-married*, *Divorced*).
- `occupation`: Occupational field (e.g., *Tech-support*, *Craft-repair*, *Exec-managerial*, *Prof-specialty*).
- `relationship`: Role in household (e.g., *Husband*, *Wife*, *Own-child*, *Not-in-family*).
- `race`: Racial background (e.g., *White*, *Black*, *Asian-Pac-Islander*).
- `sex`: Gender (*Male*, *Female*).
- `native-country`: Country of origin (e.g., *United-States*, *Mexico*, *Philippines*, *Germany*).

### 3. Target Variable
- `class`: `<=50K` (approx. 76% of dataset) or `>50K` (approx. 24% of dataset).

---

## 🛠️ Data Preprocessing & Pipeline Architecture

To prevent **data leakage** and allow the model to accept raw user input directly, all transformations are bundled inside a single `scikit-learn Pipeline`:

```text
Raw User Features (JSON / DataFrame)
                │
    ┌───────────┴───────────┐
    ▼                       ▼
Numerical Features      Categorical Features
    │                       │
SimpleImputer(median)   SimpleImputer(most_frequent)
    │                       │
StandardScaler()        OneHotEncoder(handle_unknown='ignore')
    │                       │
    └───────────┬───────────┘
                ▼
        ColumnTransformer
                │
                ▼
    RandomForestClassifier (50 trees)
                │
                ▼
    Output: '<=50K' or '>50K' (with probabilities)
```

- **Missing Value Handling**:
  - Numerical missing values are replaced with the **median**.
  - Categorical missing values are replaced with the **most frequent category**.
- **Categorical Encoding**: One-Hot Encoding transforms categorical strings into binary columns. Unknown categories in production default safely to all zeros (`handle_unknown='ignore'`).
- **Feature Scaling**: Numerical columns are standardized to zero mean and unit variance.

---

## 🏆 Model Training & Performance

Two classification models were trained using an **80/20 Stratified Train/Test Split** (39,073 training samples / 9,769 testing samples):

| Model | Test Accuracy | Macro F1-Score | Selected |
| :--- | :---: | :---: | :---: |
| **Random Forest Classifier** (50 trees) | **85.76%** | **0.79** | ✅ **Selected** |
| **Logistic Regression** | **85.24%** | **0.78** | ❌ Baseline |

### Random Forest Classification Report
```text
              precision    recall  f1-score   support

       <=50K       0.89      0.93      0.91      7431
        >50K       0.74      0.63      0.68      2338

    accuracy                           0.86      9769
   macro avg       0.81      0.78      0.79      9769
weighted avg       0.85      0.86      0.85      9769
```

### Confusion Matrix Breakdown (Test Set: 9,769 samples)
- **True Negatives (`<=50K` correctly predicted)**: 6,905
- **False Positives (`<=50K` predicted as `>50K`)**: 526
- **False Negatives (`>50K` predicted as `<=50K`)**: 865
- **True Positives (`>50K` correctly predicted)**: 1,473

---

## 📁 Files in this Folder

```text
model-training/
├── Census_Income_Model (1).ipynb   # Original reference notebook from Google Colab
├── training.ipynb                  # Clean, 15-section structured notebook
├── train_model.py                  # Standalone automated training script
├── census_income_model.pkl         # Serialized complete ML pipeline (joblib)
├── model_metrics.json              # Exact metrics for API and Dashboard
├── dataset_info.json               # Schema metadata for frontend forms
├── requirements.txt                # Exact pinned dependencies
└── README.md                       # Phase 1 documentation (this file)
```

---

## 🚀 How to Run the Training Script

To retrain the model and regenerate all artifacts in one step:

```powershell
python model-training/train_model.py
```

Expected output:
1. Downloads / loads the dataset from OpenML.
2. Fits both Logistic Regression and Random Forest.
3. Displays accuracy and classification report.
4. Saves `census_income_model.pkl`, `model_metrics.json`, and `dataset_info.json`.
5. Runs an automated test prediction to confirm integrity.

---

## 🔌 Compatibility & Preparation for Phase 2 (FastAPI)

When moving to **Phase 2 (FastAPI Backend)**:
1. The backend will load `census_income_model.pkl` using `joblib.load()`.
2. The FastAPI endpoint will accept raw JSON payloads matching `dataset_info.json`.
3. Because the `.pkl` includes the `ColumnTransformer`, no manual scaling or one-hot encoding code is needed in the API!
4. **Environment Match**: Ensure the backend Python environment uses `scikit-learn==1.9.1` (or matching version) as recorded in `requirements.txt`.
