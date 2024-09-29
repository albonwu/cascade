"""Fast heuristic for Wayne's generative approach, suitable for dataset generation."""

import random
from html2image import Html2Image
from PIL import Image

corpus = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "cat", "on", "off", "and", 
    "in", "out", "a", "big", "small", "green", "blue", "red", "apple", "banana", "tree", "house", 
    "runs", "eats", "sleeps", "flies", "swims", "laughs", "cries", "walks", "talks"
]

def randomize_capitalization(word):
    return random.choice([word.lower(), word.upper(), word.capitalize()])

def random_sentence(min, max):
    word_count = random.randint(min, max)
    sentence = [randomize_capitalization(random.choice(corpus)) for _ in range(word_count)]
    return ' '.join(sentence)

def random_color():
    return f"#{random.randint(0, 0xFFFFFF):06x}"

def random_length(max_value=400):
    return f"{random.randint(50, max_value)}px"  # Minimum size is 50px, can adjust if needed

def random_border_radius():
    return f"{random.randint(0, 50)}px"  

def random_box_shadow():
    x_offset = random.randint(-20, 20)
    y_offset = random.randint(-20, 20)
    blur_radius = random.randint(5, 30)
    shadow_color = random_color()
    return f"{x_offset}px {y_offset}px {blur_radius}px {shadow_color}"

def random_text_alignment():
    return random.choice(["left", "center", "right", "justify"])

def random_position(length, width, container_size=400):
    max_top = container_size - int(length[:-2])  # Subtract length from container size
    max_left = container_size - int(width[:-2])  # Subtract width from container size
    return f"top: {random.randint(0, max_top)}px; left: {random.randint(0, max_left)}px;"

def random_css():
    length = random_length(350)
    width = random_length(350)
    
    css_ruleset = {
        "position": "absolute", 
        "color": random_color(),
        "background-color": random_color(), 
        "length": length,
        "width": width,
        "border-radius": random_border_radius(),
        "box-shadow": random_box_shadow(),
        "text-align": random_text_alignment(),
        "positioning": random_position(length, width),
        "content": random_sentence(3, 7),
    }

    return css_ruleset

def format_css(css_ruleset):
    css_string = f"""
    .random-div {{
        position: {css_ruleset['position']};
        {css_ruleset['positioning']}
        width: {css_ruleset['width']};
        height: {css_ruleset['length']};
        background-color: {css_ruleset['background-color']};
        color: {css_ruleset['color']};
        border-radius: {css_ruleset['border-radius']};
        box-shadow: {css_ruleset['box-shadow']};
        text-align: {css_ruleset['text-align']};
        display: flex;
        justify-content: center;
        align-items: center;
    }}

    .random-div::before {{
        content: {css_ruleset['content']};
    }}
    """
    return css_string

def format_html_css(css_ruleset):
    html_css_string = f"""
    <html>
    <head>
        <style>
        body {{
            width: 400px;
            height: 400px;
            position: relative;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
        }}
        .random-div {{
            position: {css_ruleset['position']};
            {css_ruleset['positioning']}
            width: {css_ruleset['width']};
            height: {css_ruleset['length']};
            background-color: {css_ruleset['background-color']};
            color: {css_ruleset['color']};
            border-radius: {css_ruleset['border-radius']};
            box-shadow: {css_ruleset['box-shadow']};
            text-align: {css_ruleset['text-align']};
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            font-size: 18px;
        }}
        </style>
    </head>
    <body>
        <div class="random-div">{css_ruleset['content']}</div>
    </body>
    </html>
    """
    return html_css_string

def html_to_png(html_content, output_filename="styled_div.png"):
    hti = Html2Image()
    hti.screenshot(html_str=html_content, save_as="test.png")
    print(f"Image saved as {output_filename}")

if "__main__" == __name__:
    css_ruleset = random_css()
    css_string = format_css(css_ruleset)
    html_css_string = format_html_css(css_ruleset)
    html_to_png(html_css_string)
    full_image = Image.open("test.png")
    cropped_image = full_image.crop((0, 0, 400, 400))
    cropped_image.save("test_cropped.png")
    print("Done!")