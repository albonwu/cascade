# tensorflow.keras loaded lazily - ide may give resolution errors
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

import numpy as np
print("beep boop before")
model = load_model('siamese.h5')
print("beep boop after")

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(400, 400))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255.0
    return img

image1_path = "test_right.png"
image2_path = "test_wrong.png"

image1 = preprocess_image(image1_path)
image2 = preprocess_image(image2_path)

input_pair = [image1, image2]

prediction = model.predict(input_pair)
print(f"Prediction: {prediction}")
