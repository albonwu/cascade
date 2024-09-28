import time
from uuid import uuid4
from flask import Flask, request
import imgkit
from flask_cors import CORS, cross_origin

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
