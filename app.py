from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)

# connect to mongodb
client = MongoClient("mongodb://localhost:27017/")
db = client["github_events"]
events_collection = db["events"]


# home page
@app.route("/")
def home():
    return render_template("index.html")


# webhook endpoint
@app.route("/webhook", methods=["POST"])
def github_webhook():

    data = request.json
    event_type = request.headers.get("X-GitHub-Event")

    # PUSH EVENT
    if event_type == "push":

        author = data["pusher"]["name"]
        to_branch = data["ref"].split("/")[-1]
        commit_id = data["head_commit"]["id"]

        files = []

        # collect files from commits
        for commit in data["commits"]:
            files.extend(commit.get("added", []))
            files.extend(commit.get("modified", []))
            files.extend(commit.get("removed", []))

        event_data = {
            "request_id": commit_id,
            "author": author,
            "action": "PUSH",
            "from_branch": "",
            "to_branch": to_branch,
            "files": files,
            "timestamp": datetime.utcnow()
        }

        existing = events_collection.find_one({"request_id": commit_id})

        if not existing:
            events_collection.insert_one(event_data)


    # PULL REQUEST / MERGE EVENT
    elif event_type == "pull_request":

        author = data["pull_request"]["user"]["login"]
        from_branch = data["pull_request"]["head"]["ref"]
        to_branch = data["pull_request"]["base"]["ref"]
        pr_id = str(data["pull_request"]["id"])

        if data["pull_request"]["merged"]:
            action = "MERGE"
        else:
            action = "PULL_REQUEST"

        event_data = {
            "request_id": pr_id,
            "author": author,
            "action": action,
            "from_branch": from_branch,
            "to_branch": to_branch,
            "timestamp": datetime.utcnow()
        }

        existing = events_collection.find_one({"request_id": pr_id})

        if not existing:
            events_collection.insert_one(event_data)

    return jsonify({"message": "event received"})


# api for frontend
@app.route("/events")
def get_events():

    events = list(events_collection.find({}, {"_id": 0}).sort("timestamp", -1))

    return jsonify(events)


if __name__ == "__main__":
    app.run(debug=True)