import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
from pathlib import Path


# ============================================================
# MODEL ARCHITECTURE
# ============================================================

class CatDogModel(nn.Module):

    def __init__(self):
        super().__init__()

        self.features = nn.Sequential(

            nn.Conv2d(
                in_channels=3,
                out_channels=8,
                kernel_size=3,
                stride=1,
                padding=1
            ),

            nn.ReLU(),

            nn.MaxPool2d(
                kernel_size=2
            ),

            nn.Conv2d(
                in_channels=8,
                out_channels=16,
                kernel_size=3,
                stride=1,
                padding=1
            ),

            nn.ReLU(),

            nn.MaxPool2d(
                kernel_size=2
            )
        )

        self.Classifier  = nn.Sequential(

            nn.Linear(
                16 * 7 * 7,
                128
            ),

            nn.ReLU(),

            nn.Linear(
                128,
                2
            )
        )

    def forward(self, x):

        x = self.features(x)

        x = x.view(
            x.size(0),
            -1
        )

        x = self.Classifier (x)

        return x


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ============================================================
# MODEL PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "CAT_DOG_CLASSIFIER.pth"


# ============================================================
# LOAD MODEL
# ============================================================

model = CatDogModel().to(device)

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=device
    )
)

model.eval()


# ============================================================
# IMAGE TRANSFORMATION
# ============================================================

transform = transforms.Compose([
    transforms.Resize((28, 28)),
    transforms.ToTensor()
])


# ============================================================
# CLASS NAMES
# ============================================================

classes = [
    "Cat",
    "Dog"
]


# ============================================================
# PREDICTION FUNCTION
# ============================================================

def predict(image: Image.Image):

    image = image.convert("RGB")

    image_tensor = transform(image)

    image_tensor = image_tensor.unsqueeze(0)

    image_tensor = image_tensor.to(device)


    with torch.no_grad():

        output = model(
            image_tensor
        )

        probabilities = torch.softmax(
            output,
            dim=1
        )

        prediction = torch.argmax(
            probabilities,
            dim=1
        ).item()


    predicted_class = classes[
        prediction
    ]


    confidence = (
        probabilities[0][prediction].item()
        * 100
    )


    return {
        "prediction": predicted_class,
        "confidence": round(
            confidence,
            2
        )
    }

