from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask API!"})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is running smoothly"}), 200

if __name__ == '__main__':
    app.run(debug=True)
