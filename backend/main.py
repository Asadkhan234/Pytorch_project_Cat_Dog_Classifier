
import io
import os

import torch
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from model.model import predict


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="PetVision AI API",
    description="Cat and Dog image classifier powered by PyTorch",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "PetVision AI API is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ============================================================
# PREDICT
# ============================================================

@app.post("/predict")
async def predict_image(
    file: UploadFile = File(...)
):

    # Read uploaded file
    contents = await file.read()

    # Convert to PIL image
    image = Image.open(
        io.BytesIO(contents)
    ).convert("RGB")

    # Run model prediction
    result = predict(image)

    return result
