import os
import random
import time
import json
from uuid import uuid4
from flask import Flask, abort, make_response, request, send_from_directory
import imgkit
import requests
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from bson.binary import Binary
from pymongo import MongoClient

load_dotenv()

THEMES = [
    "modern",
    "clean",
    "zen",
    "retro",
    "playful",
    "lunar",
    "solar",
    "slanted",
    "grand",
    "expensive",
    "cheap",
]
COMPONENTS = [
    "checkbox",
    "circular button",
    "pill button",
    "icon with notification badge",
    "radio select",
    "progress bar",
    "search bar",
    "slider",
    "switch",
]

# access your database and collection from Atlas
# database = mongo_client.get_database(“anaiyamovies”)
# collection = database.get_collection(“movies”)

app = Flask(__name__)
cors = CORS(app)
BREADBOARD_URL = "https://breadboard-community.wl.r.appspot.com/boards/@ArtisticJellyfish/cascade-generator.bgl.api/run"


def render_html(html: str):
    return imgkit.from_string(
        html,
        False,
        options={
            "crop-h": "400",
            "crop-w": "400",
            "--height": "400",
            "--width": "400",
        },
    )


def init_mongo_client(app: Flask):
    try:
        mongo_client = MongoClient(os.getenv("MONGO-CONNECTION-STRING"))

        result = mongo_client.admin.command("ping")

        if int(result.get("ok")) == 1:
            print("Connected")
        else:
            raise Exception("Cluster ping returned OK != 1")
        app.mongo_client = mongo_client
        app.db = mongo_client.bigdata
    except Exception as e:
        print(e)


init_mongo_client(app)


@app.route("/", methods=["GET"])
def index():
    return "this is the cascade backend lesgooooooooo"


@app.route("/start_session", methods=["POST"])
def start_session():
    session_id = uuid4()
    app.db.sessions.insert_one(
        {
            "_id": str(session_id),
            "num_puzzles": 0,
            "current_puzzle": 0,
            "current_puzzle_attempts": 0,
        }
    )
    res = make_response(str(session_id))
    res.set_cookie("session_id", str(session_id))
    # todo: generate two puzzles
    generate_puzzle(str(session_id))
    return res


@app.route("/<session_id>/target")
def serve_image(session_id):
    if not session_id:
        abort(403)
    file = app.db.images.find_one({"_id": f"{session_id}.0"})
    response = make_response(file["file"])
    response.headers.set("Content-Type", "image/png")
    return response


@app.route("/submit", methods=["POST"])
def handle_submit():
    session_id = request.cookies.get("session_id")
    if not session_id:
        abort(403)
    attempt_num = app.db.images.find_one({"_id": session_id})[
        "current_puzzle_attempts"
    ]
    data = request.get_json()
    html = data["html"]
    attempt_image = render_html(html)
    attempt_name = f"{session_id}.{attempt_num}"
    app.db.images.insert_one({"_id": attempt_name, "file": attempt_image})
    app.db.sessions.update_one(
        {"_id": session_id}, {"$inc": {"current_puzzle_attempts": 1}}
    )
    # todo: compare image to correct

    return "submitted!"


# @app.route("/generate", methods=["GET"])
def generate_puzzle(session_id, theme=None, component=None):
    if not theme:
        theme = random.choice(THEMES)
    if not component:
        component = random.choice(COMPONENTS)

    context = f"Theme: {theme}, Component: {component}"
    print(f"{context = }")

    res = requests.post(
        BREADBOARD_URL,
        json={"$key": os.getenv("BREADBOARD-KEY"), "context": context},
    )
    print(f"{res.text = }")
    json_res = res.text[5:]
    data = json.loads(json_res)
    raw_output = data[1]["outputs"]["context"][-1]["parts"][0]["text"]
    raw_output_as_json = raw_output.strip("`json ")
    code_json = json.loads(raw_output_as_json)
    print(f"{code_json = }")

    session = app.db.sessions.find_one({"_id": session_id})
    puzzle_num = session["num_puzzles"]

    image = render_html(
        f"<style>{code_json['css']}</style>{code_json['html']}"
    )
    image_name = f"{session_id}.{puzzle_num}"

    app.db.images.insert_one({"_id": image_name, "file": image})
    app.db.sessions.update_one(
        {"_id": session_id}, {"$inc": {"num_puzzles": 1}}
    )
    return image_name
