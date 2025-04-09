from transformers import ViTFeatureExtractor, ViTForImageClassification
from PIL import Image
import torch

# Load model and feature extractor once
model_name = "DrishtiSharma/finetuned-ViT-Indian-Food-Classification-v3"
model = ViTForImageClassification.from_pretrained(model_name)
extractor = ViTFeatureExtractor.from_pretrained(model_name)

def classify_indian_food(image: Image.Image):
    # Preprocess and predict
    inputs = extractor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_idx = logits.argmax(-1).item()
        label = model.config.id2label[predicted_idx]
    return label
