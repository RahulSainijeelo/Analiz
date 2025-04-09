from transformers import AutoModelForImageClassification, AutoImageProcessor
from PIL import Image
import torch

# Load model and processor once at startup
model = AutoModelForImageClassification.from_pretrained("jazzmacedo/fruits-and-vegetables-detector-36")
processor = AutoImageProcessor.from_pretrained("jazzmacedo/fruits-and-vegetables-detector-36")
labels = list(model.config.id2label.values())

def classify_food(image: Image.Image):
    # Preprocess the image using the Hugging Face processor
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    predicted_idx = torch.argmax(outputs.logits, dim=1).item()
    predicted_label = labels[predicted_idx]
    return predicted_label
