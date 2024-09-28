"""Generate training data."""

from selenium import webdriver

def capture_screenshot(url, css_file, output_path):
    driver = webdriver.Chrome()
    driver.get(url)


    with open(css_file, "r") as css:
        driver.execute_script(f"{css.read()}")

    driver.save_screenshot(output_path)
    driver.quit()

capture_screenshot("http://0.0.0.0:5000", "css_dataset/reference_styles.css", "reference_image.png")
capture_screenshot("http://0.0.0.0:5000", "css_dataset/variant_styles_1.css", "variant_image_1.png")