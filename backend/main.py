from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image

from io import BytesIO

import sys
from pathlib import Path


# ============================================================
# FIND MODEL DIRECTORY
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

MODEL_DIR = PROJECT_ROOT / "model"

sys.path.append(str(MODEL_DIR))


# Import our model

from model import predict


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="PetVision AI API",
    description="Cat and Dog image classifier",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message": "PetVision AI API is running"
    }


# ============================================================
# PREDICTION
# ============================================================

@app.post("/predict")
async def predict_image(
    file: UploadFile = File(...)
):

    # Read uploaded file

    contents = await file.read()


    # Convert bytes to image

    image = Image.open(
        BytesIO(contents)
    ).convert("RGB")


    # Run model

    result = predict(
        image
    )


    return result

