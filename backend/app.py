from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
users = {
    "user@example.com": {
        "password": "password123",
    }
}

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if email not in users:
        return jsonify({"error": "User not found"}), 404

    if users[email]["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"}), 200


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if email in users:
        return jsonify({"error": "Email already registered"}), 400

    users[email] = {"password": password}
    return jsonify({"message": "Signup successful"}), 201

if __name__ == "__main__":
    app.run(debug=True)
