"""For large-scale dataset generation, use generate_data.py."""

import os 
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

load_dotenv()

temp_html_file_path = os.getenv("TEMP_HTML_FILE_PATH")

options = Options()
options.headless = True  
driver = webdriver.Chrome(options=options)
# rendering on high-DPI screens can inflate dimensions
device_pixel_ratio = driver.execute_script("return window.devicePixelRatio;")

html_content = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Temporary CSS render</title>
    <style>
        .screenshot-div {
            width: 150px;
            height: 150px;
            background-color: lightblue;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            border: 2px solid blue;
        }
    </style>
</head>
<body>
    <div class="screenshot-div">This is not a test div</div>
</body>
</html>
'''

with open('temp.html', 'w') as file:
    file.write(html_content)

driver.get(f"file://{temp_html_file_path}") 

div_element = driver.find_element(By.CLASS_NAME, "screenshot-div")
location = div_element.location
size = div_element.size
driver.save_screenshot("dataset/reference3.png")  

# crop screenshot
from PIL import Image

x = location['x']
y = location['y']
width = size['width']
height = size['height']

print(x, y, width, height)

full_image = Image.open("dataset/reference3.png")
cropped_image = full_image.crop((0, 0, 400, 400))
cropped_image.save("dataset/reference3_cropped.png")

driver.quit()

print("Screenshot saved as dataset/reference2_cropped.png")
