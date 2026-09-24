"""
Census Income Prediction — Model Training Script
Phase 1: Model Training

This script reproduces the complete machine learning workflow:
1. Loads the Adult/Census Income dataset from OpenML.
2. Preprocesses numerical and categorical features inside a scikit-learn Pipeline.
3. Performs a stratified 80/20 train/test split.
4. Trains and evaluates Logistic Regression and Random Forest models.
5. Saves the final Random Forest Pipeline to 'census_income_model.pkl'.
6. Generates 'model_metrics.json' and 'dataset_info.json' for the FastAPI backend and React frontend.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

# Set paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(CURRENT_DIR, "census_income_model.pkl")
METRICS_FILE = os.path.join(CURRENT_DIR, "model_metrics.json")
DATASET_INFO_FILE = os.path.join(CURRENT_DIR, "dataset_info.json")


def load_and_prepare_data():
    """Fetches the Adult dataset from OpenML and prepares features and target."""
    print("=" * 60)
    print("1. Loading Adult/Census Income dataset from OpenML...")
    print("=" * 60)
    
    adult = fetch_openml(name='adult', version=2, as_frame=True)
    df = adult.frame.copy()
    
    print(f"Dataset loaded successfully! Total rows: {df.shape[0]}, Total columns: {df.shape[1]}")
    
    # Clean target values: remove potential trailing periods (e.g. '<=50K.' -> '<=50K')
    y = df['class'].astype(str).str.replace('.', '', regex=False)
    X = df.drop(columns=['class'])
    
    print(f"Target classes: {list(y.unique())}")
    print(f"Features shape: {X.shape}")
    
    return df, X, y


def build_preprocessor(X):
    """Builds a ColumnTransformer for numerical and categorical preprocessing."""
    numeric_features = X.select_dtypes(include=['number']).columns.tolist()
    categorical_features = X.select_dtypes(exclude=['number']).columns.tolist()
    
    print("\n" + "=" * 60)
    print("2. Building Preprocessing Transformers...")
    print("=" * 60)
    print(f"Numerical features ({len(numeric_features)}): {numeric_features}")
    print(f"Categorical features ({len(categorical_features)}): {categorical_features}")
    
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )
    
    return preprocessor, numeric_features, categorical_features


def train_and_evaluate():
    """Main training, evaluation, and artifact export function."""
    df, X, y = load_and_prepare_data()
    preprocessor, numeric_features, categorical_features = build_preprocessor(X)
    
    # 80/20 Stratified Train/Test Split
    print("\n" + "=" * 60)
    print("3. Performing 80/20 Stratified Train/Test Split...")
    print("=" * 60)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training samples: {len(X_train)} ({(len(X_train)/len(X))*100:.1f}%)")
    print(f"Testing samples:  {len(X_test)} ({(len(X_test)/len(X))*100:.1f}%)")
    
    # --- 1. Train Logistic Regression ---
    print("\n" + "=" * 60)
    print("4. Training Logistic Regression Baseline...")
    print("=" * 60)
    logistic_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', LogisticRegression(max_iter=1000, random_state=42))
    ])
    logistic_pipeline.fit(X_train, y_train)
    logistic_pred = logistic_pipeline.predict(X_test)
    logistic_acc = float(accuracy_score(y_test, logistic_pred))
    print(f"Logistic Regression Accuracy: {logistic_acc:.4f} ({logistic_acc*100:.2f}%)")
    
    # --- 2. Train Random Forest Classifier ---
    print("\n" + "=" * 60)
    print("5. Training Random Forest Classifier (Selected Model)...")
    print("=" * 60)
    rf_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', RandomForestClassifier(
            n_estimators=50,
            random_state=42,
            n_jobs=-1
        ))
    ])
    rf_pipeline.fit(X_train, y_train)
    rf_pred = rf_pipeline.predict(X_test)
    rf_acc = float(accuracy_score(y_test, rf_pred))
    print(f"Random Forest Accuracy: {rf_acc:.4f} ({rf_acc*100:.2f}%)")
    
    # Detailed Evaluation for Random Forest
    labels = ['<=50K', '>50K']
    cm = confusion_matrix(y_test, rf_pred, labels=labels)
    # cm layout: [[TN, FP], [FN, TP]] where '<=50K' is negative and '>50K' is positive
    tn, fp, fn, tp = int(cm[0][0]), int(cm[0][1]), int(cm[1][0]), int(cm[1][1])
    
    precision_macro = float(precision_score(y_test, rf_pred, average='macro'))
    recall_macro = float(recall_score(y_test, rf_pred, average='macro'))
    f1_macro = float(f1_score(y_test, rf_pred, average='macro'))
    
    precision_weighted = float(precision_score(y_test, rf_pred, average='weighted'))
    recall_weighted = float(recall_score(y_test, rf_pred, average='weighted'))
    f1_weighted = float(f1_score(y_test, rf_pred, average='weighted'))
    
    report_dict = classification_report(y_test, rf_pred, target_names=labels, output_dict=True)
    
    print("\n" + "=" * 60)
    print("6. Classification Report (Random Forest):")
    print("=" * 60)
    print(classification_report(y_test, rf_pred, target_names=labels))
    
    print("Confusion Matrix:")
    print(f"  True <=50K (TN): {tn:5d}  | False >50K (FP): {fp:5d}")
    print(f"  False <=50K (FN):{fn:5d}  | True >50K (TP):  {tp:5d}")
    
    # Save Model Pipeline
    print("\n" + "=" * 60)
    print("7. Saving Final Pipeline & Artifacts...")
    print("=" * 60)
    joblib.dump(rf_pipeline, MODEL_FILE)
    print(f"[OK] Saved model pipeline -> {MODEL_FILE}")
    
    # Generate model_metrics.json
    model_metrics = {
        "selected_model": "Random Forest Classifier",
        "parameters": {
            "n_estimators": 50,
            "random_state": 42,
            "n_jobs": -1
        },
        "accuracy": round(rf_acc, 6),
        "precision_macro": round(precision_macro, 4),
        "recall_macro": round(recall_macro, 4),
        "f1_macro": round(f1_macro, 4),
        "precision_weighted": round(precision_weighted, 4),
        "recall_weighted": round(recall_weighted, 4),
        "f1_weighted": round(f1_weighted, 4),
        "target_classes": labels,
        "sample_counts": {
            "total_samples": int(len(df)),
            "training_samples": int(len(X_train)),
            "testing_samples": int(len(X_test))
        },
        "confusion_matrix": {
            "matrix": cm.tolist(),
            "labels": labels,
            "true_negative": tn,
            "false_positive": fp,
            "false_negative": fn,
            "true_positive": tp
        },
        "class_metrics": {
            "<=50K": {
                "precision": round(report_dict["<=50K"]["precision"], 4),
                "recall": round(report_dict["<=50K"]["recall"], 4),
                "f1_score": round(report_dict["<=50K"]["f1-score"], 4),
                "support": int(report_dict["<=50K"]["support"])
            },
            ">50K": {
                "precision": round(report_dict[">50K"]["precision"], 4),
                "recall": round(report_dict[">50K"]["recall"], 4),
                "f1_score": round(report_dict[">50K"]["f1-score"], 4),
                "support": int(report_dict[">50K"]["support"])
            }
        },
        "model_comparison": [
            {
                "model_name": "Random Forest Classifier",
                "accuracy": round(rf_acc, 6),
                "selected": True
            },
            {
                "model_name": "Logistic Regression",
                "accuracy": round(logistic_acc, 6),
                "selected": False
            }
        ]
    }
    
    with open(METRICS_FILE, "w", encoding="utf-8") as f:
        json.dump(model_metrics, f, indent=2)
    print(f"[OK] Saved metrics -> {METRICS_FILE}")
    
    # Generate dataset_info.json
    dataset_info = {
        "dataset_name": "Adult / Census Income Dataset (OpenML version 2)",
        "description": "Predict whether an individual's annual income exceeds $50K/year based on census data.",
        "total_samples": int(len(df)),
        "total_features": int(X.shape[1]),
        "target_column": "class",
        "target_classes": labels,
        "target_distribution": {
            "<=50K": int((y == "<=50K").sum()),
            ">50K": int((y == ">50K").sum())
        },
        "numerical_features": numeric_features,
        "categorical_features": categorical_features,
        "feature_count": {
            "numerical": len(numeric_features),
            "categorical": len(categorical_features),
            "total": len(numeric_features) + len(categorical_features)
        },
        "features_detail": {
            "age": "Age of the individual (numeric)",
            "workclass": "Employment sector/status (categorical)",
            "fnlwgt": "Final sampling weight (numeric)",
            "education": "Highest level of education completed (categorical)",
            "education-num": "Highest level of education in numerical format (numeric)",
            "marital-status": "Marital status of the individual (categorical)",
            "occupation": "General occupational category (categorical)",
            "relationship": "Relationship status to householder (categorical)",
            "race": "Race/ethnicity (categorical)",
            "sex": "Gender (categorical)",
            "capital-gain": "Capital gains recorded (numeric)",
            "capital-loss": "Capital losses recorded (numeric)",
            "hours-per-week": "Working hours per week (numeric)",
            "native-country": "Country of origin (categorical)"
        }
    }
    
    with open(DATASET_INFO_FILE, "w", encoding="utf-8") as f:
        json.dump(dataset_info, f, indent=2)
    print(f"[OK] Saved dataset info -> {DATASET_INFO_FILE}")
    
    # --- 8. Sample Prediction Verification ---
    print("\n" + "=" * 60)
    print("8. Verifying Sample Prediction with Saved Model Pipeline...")
    print("=" * 60)
    loaded_model = joblib.load(MODEL_FILE)
    sample = X_test.iloc[[0]]
    prediction = loaded_model.predict(sample)[0]
    probabilities = loaded_model.predict_proba(sample)[0]
    
    print("Sample Input Features:")
    for col in sample.columns:
        print(f"  {col}: {sample[col].values[0]}")
    print(f"\nModel Prediction: {prediction}")
    print(f"Class Probabilities: <=50K: {probabilities[0]:.4f}, >50K: {probabilities[1]:.4f}")
    print(f"Actual Label: {y_test.iloc[0]}")
    print("\n[SUCCESS] Phase 1 model training and verification complete!")


if __name__ == "__main__":
    train_and_evaluate()
