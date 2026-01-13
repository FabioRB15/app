from rembg import remove
from PIL import Image
import os

input_path = r"C:/Users/Fabio/.gemini/antigravity/brain/70c575ff-be8b-4d72-ad14-3ec9d98b70f9/uploaded_image_1768237376509.jpg"
output_path = r"c:/Users/Fabio/Documents/app/frontend/public/logo.png"

try:
    print(f"Opening image: {input_path}")
    input_image = Image.open(input_path)
    
    print("Removing background...")
    output_image = remove(input_image)
    
    print(f"Saving to: {output_path}")
    output_image.save(output_path, "PNG")
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
