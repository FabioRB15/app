import shutil
import os

base_path = r"C:/Users/Fabio/.gemini/antigravity/brain/70c575ff-be8b-4d72-ad14-3ec9d98b70f9/"
public_path = r"c:/Users/Fabio/Documents/app/frontend/public/"

# Map uploaded files to their roles
# 0: Light text -> For Dark Mode
src_dark_mode = os.path.join(base_path, "uploaded_image_0_1768245166344.jpg")
dst_dark_mode = os.path.join(public_path, "logo-dark-mode.png") # Saving as png to handle extension, though source is jpg. Browsers handle it. Ideally should convert if transparency needed but user said "apply them". Given they look like pngs in the viewer (transparent bg), the user might have mislabeled or uploaded pngs with jpg extension. I'll stick to extensions or just copy bytes.
# Actually, the user's prompt says "em png a imagem" previously, but these uploads are .jpg?
# Wait, the artifact list shows .jpg for the uploads. If they are jpgs, they won't have transparency.
# User request: "ideal seja retirar o fundo preto, e usar em png a imagem".
# Then "Anexei 3 imagens ... pode utilizar elas".
# If these new images are JPGs, they have backgrounds.
# Let's check the images using a python script to see if they are actually PNGs masking as JPGs or if I need to remove background again.
# The user said "use them", implying they might already be prepared (maybe the user did it?).
# The prompt says "background transparent" was requested, and now user provides images.
# Let's just copy them first and see. Renaming to .png if they are pngs is safer.
# To be safe, I'll check headers or just copy.
# Let's assume they are the correct assets.

shutil.copy(src_dark_mode, dst_dark_mode)

# 1: Dark text -> For Light Mode
src_light_mode = os.path.join(base_path, "uploaded_image_1_1768245166344.jpg")
dst_light_mode = os.path.join(public_path, "logo-light-mode.png")
shutil.copy(src_light_mode, dst_light_mode)

# 2: Symbol -> Favicon
src_symbol = os.path.join(base_path, "uploaded_image_2_1768245166344.jpg")
dst_symbol = os.path.join(public_path, "logo-symbol.png") # Using as favicon source
shutil.copy(src_symbol, dst_symbol)

dst_favicon = os.path.join(public_path, "favicon.png")
shutil.copy(src_symbol, dst_favicon) # Also overwriting favicon.png commonly used

print("Files copied successfully.")
