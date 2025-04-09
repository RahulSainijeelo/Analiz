from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io
from .food_model import classify_food
from .fruit_model import classify_fruit

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Welcome to Fruit & Food Classifier API"}

@app.post("/predict/food")
async def predict_food(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    result = classify_food(image)
    return {"prediction": result}

@app.post("/predict/fruit")
async def predict_fruit(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    result = classify_fruit(image)
    return {"prediction": result}
