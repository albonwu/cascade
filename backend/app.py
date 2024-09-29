import os
import time
import json
from uuid import uuid4
from flask import Flask, request
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
    imgkit.from_string(
        html,
        f"{puzzle_id}.{time.time()}.png",
        options={
            "crop-h": "400",
            "crop-w": "400",
            "--height": "400",
            "--width": "400",
        },
    )
    return "<p>Hello world!</p>"


BREADBOARD_URL = "https://breadboard-community.wl.r.appspot.com/boards/@ArtisticJellyfish/cascade-generator.bgl.api/run"


@app.route("/generate", methods=["GET"])
def generate_component():
    res = requests.post(
        BREADBOARD_URL,
        json={
            "$key": os.getenv("BREADBOARD-KEY"),
            "context": "Theme: Playful, Component: <button>",
        },
    )
    # print(f"{res.text = }")
    json_res = res.text[5:]
    data = json.loads(json_res)

    print(data)

    raw_output = data[1]["outputs"]["context"][-1]["parts"][0]["text"]

    raw_output_as_json = raw_output.strip("`json ")

    code_json = json.loads(raw_output_as_json)

    imgkit.from_string(
        f"<style>{code_json['css']}</style>{code_json['html']}",
        "output.png",
        options={
            "crop-h": "400",
            "crop-w": "400",
            "--height": "400",
            "--width": "400",
        },
    )

    return code_json["css"]
