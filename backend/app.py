import firebase_admin
from firebase_admin import credentials, auth, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import cv2 as cv
import dlib
import numpy as np
from imutils import face_utils
from numpy.linalg import norm
from time import time
import base64
import cv2 as cv
import dlib
import numpy as np
from imutils import face_utils
from flask import Flask, Response
import time
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=api_key)

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')

from numpy.linalg import norm

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
        "user_name": userName,
        "other_info": ""
    })

    return jsonify({
        "message": "Signup successful",
        "user_id": user_id,
        "user_name": userName,  
    }), 201


# Helper function to calculate distances
def gen_frames():
    cap = cv.VideoCapture(0)  # Access webcam

    while True:
        ret, image = cap.read()
        if not ret:
            break

        gray_image = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
        faces = detector(gray_image, 0)

        for face in faces:
            landmarks = predictor(gray_image, face)
            landmarks = face_utils.shape_to_np(landmarks)

            # Extracting relevant facial regions for smile detection
            jaw_width = norm(landmarks[2] - landmarks[14])
            lips_width = norm(landmarks[54] - landmarks[48])

            lip_jaw_ratio = lips_width / jaw_width
            mouth_opening = norm(landmarks[57] - landmarks[51])
            mouth_nose = norm(landmarks[33] - landmarks[51])

            # Smile detection logic
            if lip_jaw_ratio > 0.44:
                if mouth_opening / mouth_nose >= 1.05:
                    # Apply a better text style with outline
                    text = 'Smiling!'
                    font = cv.FONT_HERSHEY_COMPLEX
                    scale = 1.5
                    color = (246, 71, 144)  # Green color
                    thickness = 3
                    
                    (w, h), _ = cv.getTextSize(text, font, scale, thickness)
                    x, y = face.left(), face.top() - 20
                    
                    # Outline the text
                    cv.putText(image, text, (x-2, y-2), font, scale, (0, 0, 0), thickness + 2)
                    cv.putText(image, text, (x, y), font, scale, color, thickness)

            # Draw mouth polygon on the image with smoother polyline
            mouth_landmarks = landmarks[48:60]
            mouth_poly = np.array(mouth_landmarks, np.int32)
            mouth_poly = mouth_poly.reshape((-1, 1, 2))

            # Drawing the mouth with thicker and smoother edges
            cv.polylines(image, [mouth_poly], True, (255, 0, 0), 3)  # Red color
            cv.fillPoly(image, [mouth_poly], (255, 255, 255))  # White fill for polish

        # Encode frame as JPEG and send to the frontend
        ret, buffer = cv.imencode('.jpg', image)
        if not ret:
            continue
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/generate-todos', methods=['POST'])
def complete_string():
    user_input = request.json.get("input", "")
    user_id = request.json.get("user_id", "")

    if not user_input or not user_id:
        return jsonify({"error": "Input string and userId are required"}), 400

    try:
        calendar_query = db.collection("calendarData").where("user_id", "==", user_id).limit(2)
        calendar_docs = list(calendar_query.get())
        
        # Retrieve user's additional info (like "other_info")
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404
        user_data = user_doc.to_dict()
        other_info = user_data.get("other_info", "")

        # Prepare context from calendar entries
        calendar_context = ""
        if calendar_docs:
            for doc in calendar_docs:
                calendar_data = doc.to_dict()
                calendar_context += f"Date: {calendar_data.get('date', 'N/A')}, Mood: {calendar_data.get('mood', 'N/A')}, Notes: {calendar_data.get('notes', 'N/A')}. "
        
    
        # Modify prompt based on calendar context availability
        system_prompt = (
            "You are a planner generating personalized tasks. Format as title:description+title:description+title:description. "
            + ("This is user calender info: " if calendar_context else "")
            + "Use the user's additional context: " + other_info + " "
            + "Generate exactly three tasks, formatted as title:description+title:description+title:description. Make the description a short sentence."
        )

        full_prompt = f"User request: {user_input}"
        
        response = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": full_prompt},
               
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.9,
            max_completion_tokens=150,
            stream=False
        )
        
        # You can ask the AI again to format it for you precisely in the desired structure
        system_prompt_ensure_format = (
            "Please ensure the following tasks are formatted in this exact structure, do not add anything else other than the formatted text. The text will be a title and desicription of three things and you need to seperate them into the given format: "
            "title:description+title:description+title:description. "
        )

        full_prompt_ensure_format = f"{response}"

        response = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt_ensure_format},
                {"role": "user", "content": full_prompt_ensure_format},
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.9,
            max_completion_tokens=150,
            stream=False
        )
        

        # Process tasks 
        tasks_text = response.choices[0].message.content

        tasks = tasks_text.split("+")[:3]

        formatted_tasks = []
        for task in tasks:
            if ':' in task:
                title, description = task.split(":", 1)
                description = description.replace(":", ":")
                formatted_tasks.append({
                    'title': title.strip(),
                    'description': description.strip()
                })

        return jsonify({
            "todos": formatted_tasks
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    user_id = data.get('userId')
    title = data.get('title')
    description = data.get('description')

    if not user_id or not title:
        return jsonify({'error': 'userId and title are required'}), 400

    # Generate a unique task ID
    task_id = str(uuid.uuid4())

    # Save the to-do item
    db.collection("ToDoItems").document(task_id).set({
        'userId': user_id,
        'title': title,
        'description': description,
        'taskId': task_id
    })

    return jsonify({'message': 'To-Do added successfully', 'taskId': task_id}), 201


@app.route('/api/todos/<user_id>', methods=['GET'])
def get_todos(user_id):
    todos_ref = db.collection("ToDoItems").where("userId", "==", user_id)
    docs = todos_ref.get()
    todos = [doc.to_dict() for doc in docs]
    return jsonify(todos), 200

@app.route('/api/todos/<task_id>', methods=['DELETE'])
def delete_todo(task_id):
    try:
        todo_ref = db.collection('ToDoItems').document(task_id)
        todo_ref.delete()  # Delete the to-do item
        
        return jsonify({'message': 'To-Do deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-quote', methods=['GET'])
def generate_quote():
    try:
        user_id = request.args.get("user_id")

        # Ensure the user ID is provided
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Retrieve user's additional info (like "other_info")
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404
        user_data = user_doc.to_dict()
        other_info = user_data.get("other_info", "")

        # Prepare the system prompt for generating an inspirational quote
        system_prompt = (
            "Generate a short, positive, and uplifting quote that motivates the user to have a great day. "
            + (f"User's additional context: {other_info}" if other_info else "")
            + "make sure the quote is really short: no longer than 8 words."
        )

        # Generate the quote using the Groq API
        response = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_completion_tokens=30,
            stream=False
        )

        quote = response.choices[0].message.content.strip()

        return jsonify({"quote": quote})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    

@app.route("/api/user-answers", methods=["POST"])
def save_user_answers():
    try:
        # Get data from the incoming request
        data = request.get_json()
        user_id = data.get("user_id")
        other_point = data.get("answer")  # New point of data

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Check if the user exists
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        # Update the user's document with the new data or "otherPoint"
        user_data = user_doc.to_dict()
        user_data["other_info"] = other_point  # Store the 'other_point'

        # Save data back to the user's document
        user_ref.update(user_data)

        return jsonify({"message": "Data stored successfully", "user_id": user_id}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)
