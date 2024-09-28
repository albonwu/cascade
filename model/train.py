import numpy as np
import tensorflow as tf
# tensorflow.keras loaded lazily - ide may give resolution errors
from tensorflow.keras.applications import VGG16
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import preprocess_input
from scipy.spatial import distance

vgg_model = VGG16(weights="imagenet", include_top=False, input_shape=(400, 400, 3))

vgg_model.summary()

def load_and_preprocess_image(image_path):
    img = image.load_img(image_path, target_size=(400, 400))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # add batch dimension
    img_array = preprocess_input(img_array)
    return img_array

image_1 = load_and_preprocess_image("/Users/albonwu/Documents/College/F24/mhacks-17/model/dataset/reference1_cropped.png")
image_2 = load_and_preprocess_image("/Users/albonwu/Documents/College/F24/mhacks-17/model/dataset/reference3_cropped.png")

features_image_1 = vgg_model.predict(image_1)
features_image_2 = vgg_model.predict(image_2)

features_image_1_flat = features_image_1.flatten()
features_image_2_flat = features_image_2.flatten()

# compute euclidean distance
euclidean = np.linalg.norm(features_image_1_flat - features_image_2_flat)
cosine = 1 - distance.cosine(features_image_1_flat, features_image_2_flat)

print("euclidean distance", euclidean)
print("cosine similarity", cosine)