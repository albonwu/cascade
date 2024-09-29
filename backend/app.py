import os
import time
import json
from uuid import uuid4
from flask import Flask, request, send_from_directory
import imgkit
import requests
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin

load_dotenv()
app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/submit", methods=["POST"])
@cross_origin()
def handle_submit():
    # attempt_uuid = uuid4()
    # session = request.cookies.get("session")
    data = request.get_json()
    print(f"{data = }")
    puzzle_id = data["puzzle_id"]
    html = data["html"]
    test = imgkit.from_string(
        html,
        f"{puzzle_id}.{time.time()}.png",
        options={
            "crop-h": "400",
            "crop-w": "400",
            "--height": "400",
            "--width": "400",
        },
    )
    return test


BREADBOARD_URL = "https://breadboard-community.wl.r.appspot.com/boards/@ArtisticJellyfish/cascade-generator.bgl.api/run"


@app.route("/generate", methods=["GET"])
def generate_component():
    theme = request.args.get("theme")
    component = request.args.get("component")
    res = requests.post(
        BREADBOARD_URL,
        json={
            "$key": os.getenv("BREADBOARD-KEY"),
            "context": f"Theme: {theme}, Component: {component}",
        },
    )

    json_res = res.text[5:]
    data = json.loads(json_res)
    raw_output = data[1]["outputs"]["context"][-1]["parts"][0]["text"]
    raw_output_as_json = raw_output.strip("`json ")
    code_json = json.loads(raw_output_as_json)

    puzzle_id = uuid4()
    imgkit.from_string(
        f"<style>{code_json['css']}</style>{code_json['html']}",
        f"static/{puzzle_id}.png",
        options={
            "crop-h": "400",
            "crop-w": "400",
            "--height": "400",
            "--width": "400",
        },
    )

    return puzzle_id


# not necessarily needed
@app.route("/images/<path:path>")
def serve_image(path):
    return send_from_directory("images", path)
