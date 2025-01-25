import firebase_admin
from firebase_admin import credentials, auth, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid

# Initialize Firebase Admin SDK with your credentials
cred = credentials.Certificate('uplife-4b5f9-firebase-adminsdk-fbsvc-e5aa016060.json')  
firebase_admin.initialize_app(cred)

app = Flask(__name__)
CORS(app)

db = firestore.client()

users_ref = db.collection("users")

@app.route("/api/calendar-data", methods=["GET"])
def get_calendar_data():
    user_id = request.args.get("user_id")
    date = request.args.get("date")  

    if not user_id or not date:
        return jsonify({"error": "User ID and date are required"}), 400

    calendar_data_ref = db.collection("calendarData").where("user_id", "==", user_id).where("date", "==", date)
    docs = calendar_data_ref.get()

    if docs:
        data = [doc.to_dict() for doc in docs]
        return jsonify(data), 200
    else:
        return jsonify({"message": "No data for this date"}), 404


@app.route("/api/calendar-data", methods=["POST"])
def save_calendar_data():
    data = request.get_json()

    user_id = data.get("user_id")
    date = data.get("date")  
    notes = data.get("notes")
    is_on_period = data.get("isOnPeriod")
    mood = data.get("mood")
    energy = data.get("energy")

    if not user_id or not date:
        return jsonify({"error": "User ID and date are required"}), 400

    calendar_data_ref = db.collection("calendarData").where("user_id", "==", user_id).where("date", "==", date)
    docs = calendar_data_ref.get()

    if docs:  # If a document already exists
        for doc in docs:
            doc_ref = doc.reference  # Get reference of the existing document
            doc_ref.set({  # Update the document with new data
                "user_id": user_id,
                "date": date,
                "notes": notes,
                "isOnPeriod": is_on_period,
                "mood": mood,
                "energy": energy
            }, merge=True)
        return jsonify({"message": "Data updated successfully"}), 200

    calendar_data_ref = db.collection("calendarData").add({
        "user_id": user_id,
        "date": date,
        "notes": notes,
        "isOnPeriod": is_on_period,
        "mood": mood,
        "energy": energy
    })

    return jsonify({"message": "Data saved successfully"}), 200



@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    

    query = users_ref.where("email", "==", email).limit(1).get()

    if not query:
        return jsonify({"error": "User not found"}), 404

    # Assuming only one user can match the email
    user_doc = query[0]
    user_data = user_doc.to_dict()

    # Check if the password matches
    if user_data["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401
    userName = user_data["user_name"]
    user_id = user_data["user_id"]

    return jsonify({
        "message": "Login successful",
        "user_id": user_id,  
        "email": email,
        "user_name": userName,
    }), 200



@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    userName = data.get("userName")

    query = users_ref.where("email", "==", email).limit(1).get()

    if query:
        return jsonify({"error": "Email already registered"}), 400

    # Create a new user ID
    user_id = str(uuid.uuid4())  # Generate a unique user ID

    users_ref.document(user_id).set({
        "email": email,  # Store the email
        "password": password,  # Store the password
        "user_id": user_id,  # Store the user_id
        "user_name": userName
    })

    return jsonify({
        "message": "Signup successful",
        "user_id": user_id,
        "user_name": userName,  
    }), 201


if __name__ == "__main__":
    app.run(debug=True)
