"""
Census Income Prediction — FastAPI Backend
Phase 2: Backend REST API

This API serves predictions from the trained Random Forest pipeline:
- Loads 'census_income_model.pkl' on server startup.
- Validates user input via Pydantic.
- Exposes GET /, GET /health, GET /metrics, GET /dataset-info, and POST /predict endpoints.
- Configured with CORS for React frontend integration.
"""

import os
import json
import logging
from contextlib import asynccontextmanager
from typing import Dict, List, Optional, Any

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("census-api")

# Directory paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(CURRENT_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "census_income_model.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "model_metrics.json")
DATASET_INFO_PATH = os.path.join(MODEL_DIR, "dataset_info.json")

# Global state dictionary for loaded artifacts
ml_artifacts: Dict[str, Any] = {
    "model": None,
    "metrics": None,
    "dataset_info": None,
    "model_loaded": False,
    "target_classes": ["<=50K", ">50K"]
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager: Loads model and metadata once when FastAPI starts."""
    logger.info("Initializing Census Income Prediction API...")
    
    # 1. Load Model Pipeline
    if os.path.exists(MODEL_PATH):
        try:
            ml_artifacts["model"] = joblib.load(MODEL_PATH)
            ml_artifacts["model_loaded"] = True
            if hasattr(ml_artifacts["model"], "classes_"):
                ml_artifacts["target_classes"] = list(ml_artifacts["model"].classes_)
            logger.info("Successfully loaded model from %s", MODEL_PATH)
        except Exception as e:
            logger.error("Failed to load model from %s: %s", MODEL_PATH, e)
            ml_artifacts["model_loaded"] = False
    else:
        logger.warning("Model file not found at %s", MODEL_PATH)
        ml_artifacts["model_loaded"] = False
        
    # 2. Load Metrics JSON
    if os.path.exists(METRICS_PATH):
        try:
            with open(METRICS_PATH, "r", encoding="utf-8") as f:
                ml_artifacts["metrics"] = json.load(f)
            logger.info("Successfully loaded metrics from %s", METRICS_PATH)
        except Exception as e:
            logger.error("Failed to load metrics from %s: %s", METRICS_PATH, e)
            
    # 3. Load Dataset Info JSON
    if os.path.exists(DATASET_INFO_PATH):
        try:
            with open(DATASET_INFO_PATH, "r", encoding="utf-8") as f:
                ml_artifacts["dataset_info"] = json.load(f)
            logger.info("Successfully loaded dataset info from %s", DATASET_INFO_PATH)
        except Exception as e:
            logger.error("Failed to load dataset info from %s: %s", DATASET_INFO_PATH, e)
            
    yield
    
    logger.info("Shutting down Census Income Prediction API.")


# Create FastAPI App
app = FastAPI(
    title="Census Income Prediction API",
    description=(
        "REST API for predicting individual income levels (>50K or <=50K) "
        "powered by a trained Random Forest scikit-learn pipeline."
    ),
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================================
# Pydantic Schemas
# =====================================================================

class CensusIncomeInput(BaseModel):
    """
    Schema representing the 14 raw census features required for prediction.
    Supports both hyphenated keys (e.g. 'education-num') and snake_case (e.g. 'education_num').
    """
    model_config = ConfigDict(populate_by_name=True)

    age: int = Field(
        ...,
        ge=17,
        le=100,
        description="Age of individual in years",
        examples=[38]
    )
    workclass: str = Field(
        ...,
        description="Employment sector/status",
        examples=["Private"]
    )
    fnlwgt: int = Field(
        ...,
        ge=0,
        description="Final sampling weight assigned by Census Bureau",
        examples=[89814]
    )
    education: str = Field(
        ...,
        description="Highest level of education completed",
        examples=["HS-grad"]
    )
    education_num: int = Field(
        ...,
        alias="education-num",
        ge=1,
        le=16,
        description="Education in numerical format (years completed)",
        examples=[9]
    )
    marital_status: str = Field(
        ...,
        alias="marital-status",
        description="Marital status",
        examples=["Married-civ-spouse"]
    )
    occupation: str = Field(
        ...,
        description="General occupational category",
        examples=["Farming-fishing"]
    )
    relationship: str = Field(
        ...,
        description="Relationship status to householder",
        examples=["Husband"]
    )
    race: str = Field(
        ...,
        description="Race/ethnicity",
        examples=["White"]
    )
    sex: str = Field(
        ...,
        description="Gender (Male / Female)",
        examples=["Male"]
    )
    capital_gain: float = Field(
        default=0.0,
        alias="capital-gain",
        ge=0.0,
        description="Capital gains recorded ($)",
        examples=[0.0]
    )
    capital_loss: float = Field(
        default=0.0,
        alias="capital-loss",
        ge=0.0,
        description="Capital losses recorded ($)",
        examples=[0.0]
    )
    hours_per_week: float = Field(
        default=40.0,
        alias="hours-per-week",
        ge=1.0,
        le=100.0,
        description="Working hours per week",
        examples=[50.0]
    )
    native_country: str = Field(
        default="United-States",
        alias="native-country",
        description="Country of origin",
        examples=["United-States"]
    )


class PredictionResponse(BaseModel):
    """Schema for income prediction response."""
    prediction: str = Field(..., description="Predicted income class (<=50K or >50K)", examples=["<=50K"])
    probabilities: Dict[str, float] = Field(
        ...,
        description="Estimated class probabilities",
        examples=[{"<=50K": 0.94, ">50K": 0.06}]
    )
    model_name: str = Field(..., description="Name of the ML model used", examples=["Random Forest Classifier"])


class HealthResponse(BaseModel):
    """Schema for health check response."""
    status: str
    model_loaded: bool
    model_name: Optional[str] = None
    target_classes: Optional[List[str]] = None


# =====================================================================
# API Endpoints
# =====================================================================

@app.get(
    "/",
    tags=["General"],
    summary="Root Welcome Endpoint",
    response_description="API status and navigation links"
)
async def root():
    """Returns a basic status message indicating the API is running."""
    return {
        "message": "Census Income Prediction API",
        "status": "running",
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_check": "/health"
    }


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["General"],
    summary="Health Check",
    response_description="Server health and model loading state"
)
async def health_check():
    """Verifies that the server is healthy and the ML model pipeline is loaded."""
    if not ml_artifacts["model_loaded"] or ml_artifacts["model"] is None:
        return HealthResponse(
            status="unhealthy",
            model_loaded=False,
            model_name=None,
            target_classes=None
        )
    
    return HealthResponse(
        status="healthy",
        model_loaded=True,
        model_name="Random Forest Classifier",
        target_classes=ml_artifacts["target_classes"]
    )


@app.get(
    "/metrics",
    tags=["Model Info"],
    summary="Get Model Performance Metrics",
    response_description="Evaluation metrics from the trained model"
)
async def get_metrics():
    """Returns actual performance metrics, confusion matrix, and sample counts from Phase 1."""
    if ml_artifacts["metrics"] is None:
        if os.path.exists(METRICS_PATH):
            try:
                with open(METRICS_PATH, "r", encoding="utf-8") as f:
                    ml_artifacts["metrics"] = json.load(f)
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Unable to read model metrics file: {str(e)}"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Model metrics metadata file not found."
            )
            
    return ml_artifacts["metrics"]


@app.get(
    "/dataset-info",
    tags=["Model Info"],
    summary="Get Dataset Schema & Features",
    response_description="Information on numerical and categorical features"
)
async def get_dataset_info():
    """Returns feature definitions, types, and schema used by the frontend to render input forms."""
    if ml_artifacts["dataset_info"] is None:
        if os.path.exists(DATASET_INFO_PATH):
            try:
                with open(DATASET_INFO_PATH, "r", encoding="utf-8") as f:
                    ml_artifacts["dataset_info"] = json.load(f)
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Unable to read dataset info file: {str(e)}"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Dataset info metadata file not found."
            )
            
    return ml_artifacts["dataset_info"]


@app.post(
    "/predict",
    response_model=PredictionResponse,
    tags=["Inference"],
    summary="Predict Income Level",
    response_description="Predicted income class and confidence probabilities"
)
async def predict_income(input_data: CensusIncomeInput):
    """
    Accepts raw demographic and employment features, passes them directly into
    the serialized scikit-learn pipeline, and returns the predicted income class and probabilities.
    """
    model = ml_artifacts.get("model")
    if model is None or not ml_artifacts.get("model_loaded"):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine learning model is not loaded. Please verify server status."
        )

    try:
        # Construct DataFrame with the exact 14 column names used during training
        feature_dict = {
            "age": [input_data.age],
            "workclass": [input_data.workclass],
            "fnlwgt": [input_data.fnlwgt],
            "education": [input_data.education],
            "education-num": [input_data.education_num],
            "marital-status": [input_data.marital_status],
            "occupation": [input_data.occupation],
            "relationship": [input_data.relationship],
            "race": [input_data.race],
            "sex": [input_data.sex],
            "capital-gain": [input_data.capital_gain],
            "capital-loss": [input_data.capital_loss],
            "hours-per-week": [input_data.hours_per_week],
            "native-country": [input_data.native_country]
        }
        input_df = pd.DataFrame(feature_dict)

        # 1. Class prediction
        raw_prediction = model.predict(input_df)[0]
        prediction_label = str(raw_prediction)

        # 2. Probability estimation
        probabilities_dict = {}
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(input_df)[0]
            classes = list(model.classes_)
            for cls_name, prob_val in zip(classes, probs):
                probabilities_dict[str(cls_name)] = round(float(prob_val), 4)

        return PredictionResponse(
            prediction=prediction_label,
            probabilities=probabilities_dict,
            model_name="Random Forest Classifier"
        )

    except Exception as e:
        logger.exception("Prediction calculation error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during model prediction: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
