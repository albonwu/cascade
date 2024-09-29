"""Fast heuristic for Wayne's generative approach, suitable for large-scale dataset generation."""

import random
import re
from html2image import Html2Image
from PIL import Image
import os

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
    return f"{random.randint(50, max_value)}px" 

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
    max_top = container_size - int(length[:-2])
    max_left = container_size - int(width[:-2]) 
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

def html_to_png(html_content, output_filename="temp.png"):
    hti = Html2Image()
    hti.screenshot(html_str=html_content, save_as=output_filename)
    print(f"Image saved as {output_filename}")

def text_discrepancy(sentence):
    words = sentence.split()
    if len(words) > 1:
        if random.random() > 0.5:
            idx1, idx2 = random.sample(range(len(words)), 2)
            words[idx1], words[idx2] = words[idx2], words[idx1] 
        else:
            idx = random.randint(0, len(words) - 1)
            words[idx] = ''.join(random.sample(words[idx], len(words[idx]))) 
    return ' '.join(words)

def color_discrepancy(color):
    color = color.lstrip('#')
    rgb = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))
    rgb = tuple(min(255, max(0, x + random.randint(-30, 30))) for x in rgb)
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"

def length_discrepancy(length):
    value = int(length[:-2])
    value = int(value * random.uniform(0.9, 1.1))
    return f"{value}px"

def text_alignment_discrepancy(alignment):
    possible_alignments = ["left", "center", "right", "justify"]
    possible_alignments.remove(alignment) 
    return random.choice(possible_alignments)

def shadow_discrepancy(shadow):
    parts = shadow.split()
    x_offset = int(parts[0][:-2]) + random.randint(-5, 5)
    y_offset = int(parts[1][:-2]) + random.randint(-5, 5)
    blur_radius = int(parts[2][:-2]) + random.randint(-5, 5)
    color = color_discrepancy(parts[3])
    return f"{x_offset}px {y_offset}px {blur_radius}px {color}"

def discrepancies(css_ruleset):
    css_faulty = css_ruleset.copy()
    
    css_faulty['content'] = text_discrepancy(css_faulty['content'])
    css_faulty['color'] = color_discrepancy(css_faulty['color'])
    css_faulty['background-color'] = color_discrepancy(css_faulty['background-color'])
    css_faulty['length'] = length_discrepancy(css_faulty['length'])
    css_faulty['width'] = length_discrepancy(css_faulty['width'])
    css_faulty['text-align'] = text_alignment_discrepancy(css_faulty['text-align'])
    css_faulty['box-shadow'] = shadow_discrepancy(css_faulty['box-shadow'])
    
    return css_faulty

if "__main__" == __name__:
    # for i in range(500, 501):
        # filename = f"dataset/ref_{i}_right.png"
        # css_ruleset = random_css()
        # css_string = format_css(css_ruleset)
        # html_css_string = format_html_css(css_ruleset)
        # html_to_png(html_css_string)

        # full_image = Image.open("temp.png")
        # cropped_image = full_image.crop((0, 0, 400, 400))
        # cropped_image.save(filename)

        # filename = f"dataset/ref_{i}_wrong.png"
        # css_faulty = discrepancies(css_ruleset)
        # css_string_faulty = format_css(css_faulty)
        # html_css_string_faulty = format_html_css(css_faulty)
        # html_to_png(html_css_string_faulty)

        # full_image = Image.open("temp.png")
        # cropped_image = full_image.crop((0, 0, 400, 400))
        # cropped_image.save(filename)

        # print("Done with iteration", i)
    filename = f"test_right.png"
    css_ruleset = random_css()
    css_string = format_css(css_ruleset)
    html_css_string = format_html_css(css_ruleset)
    html_to_png(html_css_string)

    full_image = Image.open("temp.png")
    cropped_image = full_image.crop((0, 0, 400, 400))
    cropped_image.save(filename)

    filename = f"test_wrong.png"
    css_ruleset["positioning"] = re.sub(r'top:\s*(\d+)px', lambda m: f"top: {int(m.group(1)) + 2}px", css_ruleset["positioning"])
    css_faulty = css_ruleset
    css_string_faulty = format_css(css_faulty)
    html_css_string_faulty = format_html_css(css_faulty)
    html_to_png(html_css_string_faulty)

    full_image = Image.open("temp.png")
    cropped_image = full_image.crop((0, 0, 400, 400))
    cropped_image.save(filename)
