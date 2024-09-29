from flask import Flask, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Initialize Flask app
app = Flask(__name__)

# Load your Siamese model (ensure siamese.h5 is in the same directory)
model = load_model('siamese.h5')

# Preprocess image function (adjust based on your model's requirements)
def preprocess_image(img_path, target_size=(400, 400)):
    img = image.load_img(img_path, target_size=target_size)
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    img = img / 255.0  # Normalize pixel values (if needed)
    return img

# Define the route for running the Siamese model
@app.route('/predict', methods=['POST'])
def run_siamese_model():
    # Get the image paths from the request (or upload the images via form-data)
    image1_path = request.form.get('image1')
    image2_path = request.form.get('image2')

    # Preprocess the images
    img1 = preprocess_image(image1_path)
    img2 = preprocess_image(image2_path)

    # Run the Siamese network
    prediction = model.predict([img1, img2])

    # Return the prediction result as JSON
    return jsonify({'similarity_score': float(prediction[0])})

# Start the Flask server
if __name__ == '__main__':
    app.run(debug=True)

