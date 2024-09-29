import os
import time
import json
from uuid import uuid4
from flask import Flask, make_response, request, send_from_directory
import imgkit
import requests
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from bson.binary import Binary
from pymongo import MongoClient

load_dotenv()


# access your database and collection from Atlas
# database = mongo_client.get_database(“anaiyamovies”)
# collection = database.get_collection(“movies”)

app = Flask(__name__)
cors = CORS(app)
BREADBOARD_URL = "https://breadboard-community.wl.r.appspot.com/boards/@ArtisticJellyfish/cascade-generator.bgl.api/run"


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
            "current_puzzle_attempts": 0,
        }
    )
    res = make_response(str(session_id))
    res.set_cookie("session_id", str(session_id))
    return res


@app.route("/serve")
def serve():
    file = app.db.images.find_one({"id": "test"})
    print(f'{file["file"] = }')
    response = make_response(file["file"])
    response.headers.set("Content-Type", "image/png")
    return response


@app.route("/submit", methods=["POST"])
def handle_submit():
    session_id = request.cookies.get("session_id")
    attempt_num = app.db.images.find_one({"_id": session_id})[
        "current_puzzle_attempts"
    ]
    data = request.get_json()
    html = data["html"]
    attempt_image = imgkit.from_string(
        html,
        False,
        options={
            "crop-h": "400",
            "crop-w": "400",
            "--height": "400",
            "--width": "400",
        },
    )
    attempt_name = f"{session_id}.{attempt_num}"
    app.db.images.insert_one({"_id": attempt_name, "file": attempt_image})
    app.db.sessions.update_one(
        {"_id": session_id}, {"$inc": {"current_puzzle_attempts": 1}}
    )
    # todo: compare image to correct

    return "submitted!"


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
    image = imgkit.from_string(
        f"<style>{code_json['css']}</style>{code_json['html']}",
        False,
        options={
            "crop-h": "400",
            "crop-w": "400",
            "--height": "400",
            "--width": "400",
        },
    )

    app.db.images.insert_one({"id": str(puzzle_id), "file": image})

    return str(puzzle_id)
