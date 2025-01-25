import firebase_admin
from firebase_admin import credentials, auth, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Firebase Admin SDK with your credentials
cred = credentials.Certificate('uplife-4b5f9-firebase-adminsdk-fbsvc-e5aa016060.json')  
firebase_admin.initialize_app(cred)

app = Flask(__name__)
CORS(app)

# Use Firestore or Firebase Realtime Database
db = firestore.client()

# A reference to your "users" collection in Firestore
users_ref = db.collection("users")

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Query Firestore for the user with the given email
    user_doc = users_ref.document(email).get()

    if not user_doc.exists:
        return jsonify({"error": "User not found"}), 404

    user_data = user_doc.to_dict()

    if user_data["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"}), 200


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Query Firestore to check if the email already exists
    user_doc = users_ref.document(email).get()
    if user_doc.exists:
        return jsonify({"error": "Email already registered"}), 400

    # Create the new user document
    users_ref.document(email).set({"password": password})

    return jsonify({"message": "Signup successful"}), 201

if __name__ == "__main__":
    app.run(debug=True)
