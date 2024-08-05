from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  
from chat import get_response

app = Flask(__name__)
CORS(app)  

@app.get("/")
def index_get():
    return render_template("chatbot.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    if not text:
        return jsonify({"answer": "Please provide a message."}), 400
    
    response = get_response(text)
    return jsonify({"answer": response})

if __name__ == "__main__":
    app.run(debug=True)
