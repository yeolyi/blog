import torch
from PIL import Image
import open_clip
import requests
from io import BytesIO
import sys
import json

# ✅ 모델 한 번만 초기화
MODEL_NAME = 'ViT-B-16'
PRETRAINED_TAG = 'laion2b_s34b_b88k'
DEVICE = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"

model, _, preprocess = open_clip.create_model_and_transforms(MODEL_NAME, pretrained=PRETRAINED_TAG)
model = model.to(DEVICE).eval()

def get_clip_embedding_from_url(image_url: str):
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content)).convert("RGB")
    image_input = preprocess(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        image_features = model.encode_image(image_input)
        image_features /= image_features.norm(dim=-1, keepdim=True)

    return image_features.squeeze(0).cpu().numpy().tolist()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("이미지 URL을 인자로 넣어주세요.")
        sys.exit(1)

    image_url = sys.argv[1]

    try:
        embedding = get_clip_embedding_from_url(image_url)
        print(json.dumps(embedding))  # Node에서 이 결과를 파싱
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(2)