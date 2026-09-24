# Census Income Prediction Using Machine Learning
## Comprehensive Project Report

---

# 1. TITLE PAGE

**PROJECT TITLE**:  
### CENSUS INCOME PREDICTION USING MACHINE LEARNING
*An End-to-End System for Socio-Economic Income Classification Powered by Scikit-Learn, FastAPI, and React*

---

**Submitted in partial fulfillment of the requirements for the degree of**  
**[BACHELOR OF TECHNOLOGY / BACHELOR OF ENGINEERING / B.SC]**  
*in*  
**[COMPUTER SCIENCE & ENGINEERING / DATA SCIENCE / ARTIFICIAL INTELLIGENCE]**

---

**Submitted by:**  
- **Student Name**: [Your Full Name]  
- **University Roll Number / Registration No.**: [Your Roll Number]  
- **Batch / Semester**: [e.g., 2022–2026 / 8th Semester]  

**Under the Guidance of:**  
- **Faculty Supervisor / Guide**: [Guide Name & Designation]  
- **Department**: Department of Computer Science & Engineering  
- **Institution**: [Your College / University Name, City]  
- **Academic Year**: 2025–2026  

---

# 2. ABSTRACT

Income level classification is a fundamental problem in computational social science, policy making, and financial risk modeling. This project presents an end-to-end Machine Learning (ML) system designed to predict whether an individual's annual income exceeds **$50,000/year** (`>50K`) or is at or below **$50,000/year** (`<=50K`) based on demographic and employment attributes from the US Census (Adult) dataset.

The system is developed across three interconnected phases:
1. **Model Training (Phase 1)**: An automated, leakage-free data science pipeline was constructed using Scikit-Learn. A 50-tree Random Forest Classifier was trained on an 80/20 stratified split (39,073 training records / 9,769 test records), achieving a test accuracy of **85.76%** and an F1-score of **0.7939**, outperforming the baseline Logistic Regression model (**85.24%**). The complete pipeline (imputation, scaling, one-hot encoding, and estimator) was serialized into a portable `.pkl` artifact.
2. **Backend API Engineering (Phase 2)**: A high-performance asynchronous REST API was built using **FastAPI** to load the pre-trained pipeline once during startup, validate incoming multi-attribute JSON requests via **Pydantic**, and deliver real-time predictions with probability distributions.
3. **Frontend Dashboard (Phase 3)**: A responsive single-page web dashboard was engineered using **React** and **Vite** with a modern White + Blue SaaS aesthetic, providing real-time prediction forms with 1-click presets, dynamic confidence meters, a live confusion matrix visualizer, and dataset catalog exploration.

The resulting full-stack system successfully demonstrates the deployment of applied machine learning from raw data to an interactive web platform.

---

# 3. INTRODUCTION

### 3.1 Background of Income Classification
Determining an individual's income tier based on demographic characteristics provides critical insights into socio-economic mobility, labor market trends, wage disparities, and economic welfare distribution. Traditional census analysis relies heavily on manual aggregation and retrospective sampling, which is slow and resource-intensive.

### 3.2 Machine Learning in Socio-Economic Modeling
Machine learning models, particularly supervised classification algorithms, excel at identifying multi-dimensional patterns across continuous variables (such as age, working hours, capital gains) and categorical factors (such as education level, occupation, marital status, and work sector). By training on historical census records, machine learning models learn decision boundaries that generalize accurately to unseen profiles.

### 3.3 Project Scope
This project bridges the gap between machine learning experimentation and real-world deployment by engineering a complete, modular system:
- **Phase 1**: Data preprocessing, feature engineering, and model training in Python.
- **Phase 2**: Production-grade REST API backend using FastAPI.
- **Phase 3**: Responsive analytics and prediction user interface using React and Vite.

---

# 4. PROBLEM STATEMENT

Given an individual's demographic, educational, and employment profile comprising 14 attributes, formulate a binary classification algorithm to predict whether their annual gross income belongs to:
$$\text{Class } y \in \{ \le \$50\text{K}, > \$50\text{K} \}$$

The primary technical challenges include:
1. **Data Heterogeneity**: Processing mixed numerical metrics (e.g., continuous age and capital gains) alongside nominal categorical variables (e.g., occupation and native country).
2. **Missing Values**: Managing missing values across occupational and workclass categories without discarding useful records.
3. **Class Imbalance**: Handling a target distribution where approximately 76.1% of individuals earn $\le \$50\text{K}$ and 23.9% earn $> \$50\text{K}$.
4. **Data Leakage Prevention**: Ensuring that data transformations (scaling parameters and category encodings) are strictly fit on training data and not influenced by test records.

---

# 5. OBJECTIVES

The core objectives of this project are:
1. **Develop an Automated Preprocessing Pipeline**: Build a scikit-learn `ColumnTransformer` that imputes missing values, normalizes continuous features, and one-hot encodes categorical features inside a single encapsulated object.
2. **Benchmark Classification Models**: Train and evaluate a linear baseline model (**Logistic Regression**) against an ensemble decision tree model (**Random Forest Classifier**).
3. **Prevent Data Leakage**: Employ an 80/20 stratified split and strictly bind preprocessing inside a `Pipeline` to ensure robust real-world generalization.
4. **Serialize the Complete ML Pipeline**: Export the trained pipeline into `census_income_model.pkl` along with metadata JSON files (`model_metrics.json` and `dataset_info.json`).
5. **Develop a Production REST API**: Build an asynchronous FastAPI backend exposing endpoints for health monitoring, model metrics, and real-time prediction.
6. **Create an Interactive React Dashboard**: Design a modern, responsive web application enabling users to input features, view predictions with confidence meters, inspect the confusion matrix, and explore dataset schemas.

---

# 6. DATASET

The project utilizes the **Adult Census Income Dataset (OpenML Version 2)** derived from the 1994 US Census database.

### 6.1 Dataset Summary Statistics
- **Total Records**: 48,842 rows
- **Total Input Features**: 14 columns
- **Target Variable**: `class` (`<=50K` or `>50K`)
- **Target Distribution**:
  - `<=50K` (Low/Middle Income): **37,155 samples (76.07%)**
  - `>50K` (High Income): **11,687 samples (23.93%)**

### 6.2 Feature Classification

| # | Feature Name | Data Type | Description |
|---|---|---|---|
| 1 | `age` | Numerical | Age of the individual in years (Range: 17–90) |
| 2 | `fnlwgt` | Numerical | Final census sampling weight |
| 3 | `education-num` | Numerical | Highest level of education in numerical format (1–16) |
| 4 | `capital-gain` | Numerical | Recorded capital gains in USD |
| 5 | `capital-loss` | Numerical | Recorded capital losses in USD |
| 6 | `hours-per-week` | Numerical | Number of hours worked per week |
| 7 | `workclass` | Categorical | Employment sector (Private, Self-emp, Gov, etc.) |
| 8 | `education` | Categorical | Highest education level completed (Bachelors, HS-grad, etc.) |
| 9 | `marital-status` | Categorical | Marital status (Married-civ-spouse, Never-married, etc.) |
| 10 | `occupation` | Categorical | Professional occupation category (14 categories) |
| 11 | `relationship` | Categorical | Household role (Husband, Wife, Own-child, etc.) |
| 12 | `race` | Categorical | Race/ethnicity (White, Black, Asian-Pac-Islander, etc.) |
| 13 | `sex` | Categorical | Biological gender (Male, Female) |
| 14 | `native-country` | Categorical | Country of origin (41 countries) |

---

# 7. DATA PREPROCESSING PIPELINE

Preprocessing transforms raw, noisy census data into standardized numerical arrays suitable for machine learning algorithms while completely eliminating data leakage.

```text
Raw Features (14 Columns)
      │
      ├── Numerical Pipeline (6 Features)
      │     ├── SimpleImputer(strategy='median')
      │     └── StandardScaler()
      │
      └── Categorical Pipeline (8 Features)
            ├── SimpleImputer(strategy='most_frequent')
            └── OneHotEncoder(handle_unknown='ignore')
      │
      ▼
ColumnTransformer
      │
      ▼
RandomForestClassifier(n_estimators=50)
```

### 7.1 Stratified Train/Test Split
The dataset of 48,842 records was partitioned prior to any transformation using an 80/20 stratified split (`random_state=42`):
- **Training Set ($X_{train}, y_{train}$)**: **39,073 samples (80.0%)**
- **Testing Set ($X_{test}, y_{test}$)**: **9,769 samples (20.0%)**

### 7.2 Numerical Feature Preprocessing
1. **Median Imputation**: Continuous variables contain occasional outliers; the median is used to replace missing values safely without skewing distributions.
2. **Standard Scaling**: Continuous features are transformed to zero mean and unit variance ($\mu = 0, \sigma = 1$) via:
   $$z = \frac{x - \mu}{\sigma}$$

### 7.3 Categorical Feature Preprocessing
1. **Mode Imputation**: Missing categorical records are filled with the most frequent category.
2. **One-Hot Encoding**: Converts nominal categories into sparse binary columns. The `handle_unknown='ignore'` flag ensures that unexpected categories encountered in production default safely to all zeros rather than raising runtime errors.

### 7.4 Pipeline Encapsulation
Both transformers are assembled into a Scikit-Learn `ColumnTransformer` and piped directly into the classification estimator. This ensures that the FastAPI backend can accept raw, unencoded JSON inputs directly from client browsers.

---

# 8. MACHINE LEARNING MODELS

Two supervised classification algorithms were trained and benchmarked on the identical stratified training set.

### 8.1 Logistic Regression (Baseline Model)
Logistic Regression models the log-odds of the positive class ($>50\text{K}$) as a linear combination of the input features:
$$\ln\left(\frac{P(y = >50\text{K})}{1 - P(y = >50\text{K})}\right) = \beta_0 + \sum_{i=1}^{p} \beta_i x_i$$
- **Configuration**: L2 Regularization, `max_iter=1000`, `random_state=42`.
- **Purpose**: Establishes a fast, interpretable linear classification benchmark.

### 8.2 Random Forest Classifier (Selected Production Model)
Random Forest is an ensemble learning method constructed from **50 individual decision trees** (`n_estimators=50`, `random_state=42`, `n_jobs=-1`):
- **Bootstrap Aggregation (Bagging)**: Each tree is trained on a random bootstrap sample of the training data.
- **Random Feature Subspace**: At each node split, only a random subset of features is considered, decorrelating individual trees.
- **Ensemble Decision**: Final class prediction is determined by majority voting across all 50 trees, and confidence probabilities are computed as the mean predicted class probabilities across the ensemble.

---

# 9. MODEL EVALUATION & METRICS

All metrics were calculated strictly on the held-out test set of **9,769 unseen samples**.

### 9.1 Model Comparison

| Model | Test Accuracy | Macro Precision | Macro Recall | Macro F1-Score | Selected Status |
|---|---|---|---|---|---|
| **Random Forest Classifier** | **85.7611%** | **0.8128** | **0.7796** | **0.7939** | ✅ **Selected Production Model** |
| **Logistic Regression** | **85.2390%** | **0.8062** | **0.7644** | **0.7818** | ❌ Baseline Comparison |

### 9.2 Detailed Classification Report (Random Forest)

| Target Class | Precision | Recall | F1-Score | Test Support |
|---|---|---|---|---|
| **$\le \$50\text{K}$ (Majority)** | 0.8887 (88.9%) | 0.9292 (92.9%) | 0.9085 (90.9%) | 7,431 samples |
| **$> \$50\text{K}$ (Target)** | 0.7369 (73.7%) | 0.6300 (63.0%) | 0.6793 (67.9%) | 2,338 samples |
| **Macro Average** | **0.8128 (81.3%)** | **0.7796 (78.0%)** | **0.7939 (79.4%)** | 9,769 samples |
| **Weighted Average** | **0.8523 (85.2%)** | **0.8576 (85.8%)** | **0.8536 (85.4%)** | 9,769 samples |

### 9.3 Test Set Confusion Matrix

$$\begin{pmatrix} \text{True Negative (TN)}: 6,905 & \text{False Positive (FP)}: 526 \\ \text{False Negative (FN)}: 865 & \text{True Positive (TP)}: 1,473 \end{pmatrix}$$

- **True Negatives (TN)**: 6,905 individuals earning $\le \$50\text{K}$ correctly identified.
- **True Positives (TP)**: 1,473 individuals earning $> \$50\text{K}$ correctly identified.
- **False Positives (FP)**: 526 individuals earning $\le \$50\text{K}$ incorrectly classified as high income (Type I error).
- **False Negatives (FN)**: 865 individuals earning $> \$50\text{K}$ incorrectly classified as low income (Type II error).

---

# 10. SYSTEM ARCHITECTURE

The project follows a decoupled, three-tier service-oriented architecture:

```text
┌────────────────────────────────────────────────────────┐
│                   TIER 1: PRESENTATION                 │
│               React 19 + Vite Web Dashboard            │
│         (Prediction Form, KPI Cards, Confidence Bars)  │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP / REST JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                   TIER 2: API ENGINE                   │
│                    FastAPI on Uvicorn                  │
│       (Pydantic Validation, CORS, Model Lifecycle)     │
└───────────────────────────┬────────────────────────────┘
                            │  In-Memory Inference
                            ▼
┌────────────────────────────────────────────────────────┐
│                   TIER 3: ML PIPELINE                  │
│               census_income_model.pkl                  │
│    (ColumnTransformer Preprocessing + Random Forest)   │
└────────────────────────────────────────────────────────┘
```

---

# 11. BACKEND IMPLEMENTATION (FASTAPI)

The backend service is implemented in Python using the **FastAPI** framework and served with **Uvicorn**.

### 11.1 Key Technical Features
1. **Lifespan Startup Loading**: `census_income_model.pkl`, `model_metrics.json`, and `dataset_info.json` are loaded into memory once during the application startup lifecycle (`@asynccontextmanager`), ensuring $O(1)$ response time during subsequent prediction requests.
2. **Pydantic Schema Validation**: `CensusIncomeInput` validates all 14 input parameters, checking bounds (e.g., $17 \le \text{age} \le 100$, $\text{hours-per-week} \ge 1$) and supporting both hyphenated (`education-num`) and snake_case (`education_num`) JSON keys.
3. **CORS Configuration**: Configured with permissive local origins to facilitate seamless communication with the Vite frontend running on `http://127.0.0.1:5173`.

### 11.2 API Endpoints Specification

| Method | Route | Purpose | Response Payload |
|---|---|---|---|
| `GET` | `/` | Root Status | `{"message": "Census Income Prediction API", "status": "running"}` |
| `GET` | `/health` | Health Check | `{"status": "healthy", "model_loaded": true, "target_classes": [...]}` |
| `GET` | `/metrics` | Model Evaluation | Full JSON metadata containing accuracy, macro metrics, confusion matrix |
| `GET` | `/dataset-info` | Feature Schema | Definitions, types, and counts of all 14 features |
| `POST` | `/predict` | Model Inference | `{"prediction": ">50K", "probabilities": {"<=50K": 0.08, ">50K": 0.92}}` |
| `GET` | `/docs` | Interactive Docs | Auto-generated Swagger UI for interactive testing |

---

# 12. FRONTEND IMPLEMENTATION (REACT + VITE)

The frontend is built as a single-page application using **React 19** and **Vite 6**.

### 12.1 Design Philosophy: Light White + Blue Theme
The UI adopts a clean, professional SaaS analytics design:
- **Background**: Soft off-white canvas (`#F8FAFC`).
- **Cards**: Pure white containers (`#FFFFFF`) with subtle borders (`#E2E8F0`) and soft elevation shadows.
- **Primary Palette**: Professional royal blue (`#2563EB`) with soft ice-blue accents (`#EFF6FF`).
- **Typography**: High-contrast dark navy (`#0F172A`) using Google Fonts (*Outfit* and *Inter*).

### 12.2 Dashboard Components
1. **Navbar & Connection Monitor**: Displays system branding and real-time backend status badge (*"Backend Online"* in emerald vs. *"Backend Offline"* in crimson).
2. **KPI Overview Bar**: Four metric cards displaying Model Accuracy (85.76%), Macro Precision (81.3%), Macro Recall (78.0%), and Macro F1 (79.4%).
3. **Grouped 14-Feature Prediction Form**: Organized into 4 tabs:
   - *Demographics*: Age, Gender, Race, Native Country
   - *Education*: Highest Education Level, Education Num
   - *Employment*: Work Sector, Occupation, Weekly Hours
   - *Financials*: Marital Status, Relationship, Capital Gain/Loss, Final Weight
4. **1-Click Preset Buttons**: Includes *"High Income Preset"* and *"Standard Income Preset"* for instant demonstrations.
5. **Prediction Result Card**: Highlights the predicted class alongside an animated horizontal probability meter (e.g., `94% <=50K` vs `6% >50K`).
6. **Model Performance Visualizer**: Renders the $2 \times 2$ Confusion Matrix table and model comparison cards.
7. **Dataset Catalog**: Interactive feature dictionary detailing data types and sample statistics.

---

# 13. RESULTS & VERIFICATION

The full-stack system was evaluated through automated verification scripts and live browser testing:

1. **End-to-End Latency**: Prediction requests sent from the React UI to the FastAPI backend execute with sub-second response times ($\le 45\text{ ms}$).
2. **Inference Consistency**: Sample records with verified ground truths were processed:
   - *Test Profile A* (Age 38, HS-grad, Farming, Husband): Predicted **`<=50K`** with **94.0% confidence** (Actual: `<=50K`).
   - *Test Profile B* (Age 45, Bachelors, Exec-managerial, $15K Capital Gain): Predicted **`>50K`** with **100.0% confidence** (Actual: `>50K`).
3. **Input Validation Integrity**: Malformed inputs (e.g., negative ages or out-of-range hours) triggered immediate HTTP 422 validation errors without destabilizing the server.

---

# 14. RECOMMENDED SCREENSHOTS

For inclusion in the final report document or printed submission, capture the following screenshots:

1. **Figure 1: Main Dashboard Overview**
   * *Description*: Shows the top navigation bar with the *"Backend Online"* badge, hero header, and the 4 KPI metric cards.
2. **Figure 2: Prediction Interface & Quick Presets**
   * *Description*: Displays the 4-section input form with dropdowns and quick preset buttons.
3. **Figure 3: Prediction Result Card with Confidence Meters**
   * *Description*: Shows a completed classification result card (`>50K`) displaying the confidence probability bars (`100% >50K`).
4. **Figure 4: Model Performance & Confusion Matrix Heatmap**
   * *Description*: Displays the $2 \times 2$ confusion matrix grid and the Random Forest vs. Logistic Regression comparison.
5. **Figure 5: Dataset Schema Catalog**
   * *Description*: Displays the 14-feature table with numerical and categorical badges.
6. **Figure 6: Interactive Swagger API (`http://127.0.0.1:8000/docs`)**
   * *Description*: Shows the live OpenAPI documentation for `GET /health`, `GET /metrics`, and `POST /predict`.

---

# 15. ADVANTAGES OF THE SYSTEM

1. **Zero Data Leakage**: Enforces strict separation between training and test sets by binding all transformation logic within a Scikit-Learn `Pipeline`.
2. **High Prediction Accuracy**: Achieves **85.76% accuracy**, outperforming standard linear models on complex non-linear census data.
3. **End-to-End Decoupled Architecture**: Separation of concerns between ML training, API routing, and web UI enables independent maintenance and scaling.
4. **Sub-Second Real-Time Inference**: Startup pipeline loading avoids redundant file I/O during prediction requests.
5. **User-Friendly Web Interface**: Modern White + Blue SaaS UI with 1-click test presets makes machine learning accessible to non-technical users.
6. **1-Click Local Startup**: Automated `start.bat` launcher initializes all services and launches the browser automatically.

---

# 16. LIMITATIONS

1. **Historical Dataset Distribution**: The Adult Census dataset originates from 1994 census data; modern inflation, wage growth, and contemporary job titles are not reflected.
2. **Class Imbalance Sensitivity**: Because only ~24% of records belong to the $> \$50\text{K}$ tier, the model's recall on high earners is 63.0%, compared to 92.9% on lower earners.
3. **Black-Box Ensemble Limitations**: While Random Forest provides high accuracy, individual decision paths across 50 trees cannot be interpreted as directly as linear coefficients without auxiliary tools like SHAP.
4. **Local Host Dependency**: In its current state, the system is hosted locally and requires local Python and Node.js environments.

---

# 17. FUTURE SCOPE

1. **Cloud Deployment & Containerization**: Containerize both backend and frontend using **Docker** and deploy to cloud platforms (AWS ECS, Google Cloud Run, or Vercel).
2. **Explainable AI (XAI)**: Integrate **SHAP (SHapley Additive exPlanations)** or **LIME** to provide feature-level explanations for why an individual was classified into a specific income tier.
3. **Advanced Gradient Boosting Models**: Benchmark advanced gradient boosted decision trees (XGBoost, LightGBM, CatBoost) and hyperparameter tuning via Optuna.
4. **Contemporary Dataset Ingestion**: Retrain the pipeline on modern US American Community Survey (ACS) or global census data.
5. **Continuous Model Monitoring & CI/CD**: Implement automated retraining triggers and data drift monitoring using MLflow or Evidently AI.

---

# 18. CONCLUSION

This project successfully engineered, evaluated, and deployed an end-to-end Machine Learning Census Income Prediction system. By combining a leakage-free Scikit-Learn Random Forest pipeline (**85.76% test accuracy**) with an asynchronous FastAPI REST backend and a modern React web dashboard, the project demonstrates how applied data science can transition from exploratory notebooks into a functional, user-facing software product. The system operates with robust validation, sub-second response times, and an intuitive user experience suitable for academic and practical applications.

---

# 19. REFERENCES

1. **Kohavi, R. (1996)**. *Scaling Up the Accuracy of Naive-Bayes Classifiers: a Decision-Tree Hybrid*. Proceedings of the Second International Conference on Knowledge Discovery and Data Mining (KDD-96).
2. **Pedregosa, F., et al. (2011)**. *Scikit-learn: Machine Learning in Python*. Journal of Machine Learning Research, 12, 2825–2830.
3. **Breiman, L. (2001)**. *Random Forests*. Machine Learning, 45(1), 5–32.
4. **FastAPI Documentation**: Ramirez, S. *FastAPI framework, high performance, easy to learn, fast to code, ready for production*. https://fastapi.tiangolo.com/
5. **React Documentation**: Meta Open Source. *React: The library for web and native user interfaces*. https://react.dev/
6. **OpenML Database**: *Adult Census Income Dataset (ID: 1590, Version 2)*. https://www.openml.org/d/1590
