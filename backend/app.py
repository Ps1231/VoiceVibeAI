from flask import Flask, request, jsonify
from time import time
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np
import re
import pickle
import nltk
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from nltk.stem import PorterStemmer
from nltk import word_tokenize
from character_bot import get_character_reply
from julep import Client
from dotenv import load_dotenv
import os
import textwrap
from character_info import characters_info
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
# from main_script import get_character_reply
import os
from dotenv import load_dotenv

load_dotenv()

nltk.download('punkt')

# Function for text preprocessing
def preprocess_and_tokenize(data):
    # Remove html markup
    data = re.sub("(<.*?>)", "", data)
    # Remove urls
    data = re.sub(r'http\S+', '', data)
    # Remove hashtags and @names
    data = re.sub(r"(#[\d\w\.]+)", '', data)
    data = re.sub(r"(@[\d\w\.]+)", '', data)
    # Remove punctuation and non-ascii digits
    data = re.sub("(\\W|\\d)", " ", data)
    # Remove whitespace
    data = data.strip()
    # Tokenization with nltk
    data = word_tokenize(data)
    # Stemming with nltk
    porter = PorterStemmer()
    stem_data = [porter.stem(word) for word in data]
    return stem_data

# Load the model from file
model_filename = 'tfidf_svm.sav'  # Change the path if necessary
loaded_model = pickle.load(open(model_filename, 'rb'))

# Function to predict emotion using the loaded model
def predict_emotion(message, model):
    if model:
        return model.predict([message])
    else:
        return None

# Database connection details (replace with your credentials)
MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "flask_db"
COLLECTION_NAME = "todos"  # Adjust collection name as needed

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

# Initialize Flask app
app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Enable CORS for all origins (adjust for production)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@socketio.on('pingEvent')
def handle_ping_event(json):
    print('received ping: ' + str(json))
    user_msg = str(json['data']) 
    character_name = json['character']  # Extract character name from json
    user = json['user']
    title = json['title']
    query = {'user': user, 'title': title}
    print(query)
    document = collection.find_one(query)

    if not document:
        return jsonify({'message': 'Document not found'}), 404

    context = document.get('text')
    print(context)
    reply = get_character_reply(character_name, user_msg, context)
    print(reply)

    emit('pongEvent', {'data': reply})

@app.route('/store_data', methods=['POST'])
def store_data():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        text = data.get('text')
        user = data.get('user')

        if not all([title, description, text, user]):
            return jsonify({'message': 'Missing data in the request'}), 400

        # Check if a document with the same title exists
        existing_document = collection.find_one({'title': title})

        if existing_document:
            # Update the existing document
            collection.update_one(
                {'title': title},
                {'$set': {
                    'description': description,
                    'text': text,
                    'user': user
                }},
                upsert=True
            )
            message = 'Existing data updated successfully!'
        else:
            # Insert new document
            collection.insert_one({
                'title': title,
                'description': description,
                'text': text,
                'user': user,
            })
            message = 'New data stored successfully!'

        response = {
            'user': user,
            'title': title,
            'description': description,
            'text': text,
            'message': message
        }

        print(f'Processed data: {response}')  # Debugging: Print the processed data and message

        return jsonify(response)

    except Exception as e:
        print(f'Error: {str(e)}')  # Debugging: Print the error message
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Route to process sentiment analysis
@app.route('/predict_sentiment', methods=['POST'])
def predict_sentiment():
    if request.method == 'POST':
        try:
            # Parse username and title from request body
            data = request.get_json()
            print(data)
            user = data.get('user')
            title = data.get('title')

            # Check if required fields are present
            if not user or not title:
                return jsonify({'message': 'Missing required fields: username or title'}), 400

            # Fetch text from MongoDB based on username and title (adjust query as needed)
            query = {'user': user, 'title': title}
            print(query)
            document = collection.find_one(query)

            if not document:
                return jsonify({'message': 'Document not found'}), 404

            text = document.get('text')
            print(text)

            if not text:
                return jsonify({'message': 'Text field missing in document'}), 400

            try:
                message = text
                predicted_emotion = predict_emotion(message, loaded_model)
                return jsonify({'emotion': predicted_emotion[0]})
            except Exception as e:
                return jsonify({'error': str(e)})

        except Exception as e:
            print(f"Error processing request: {e}")
            return jsonify({'message': 'Internal server error'}), 500

    return jsonify({'message': 'Invalid request method'}), 405

@app.route('/character_chat', methods=['POST'])
def character_chat():
    data = request.get_json()
    user = data.get('user')
    title = data.get('title')
    character = data.get('character')
    print(data)    

    if not user or not title or not character:
        return jsonify({'message': 'Missing required fields: username, title, or character'}), 400

    query = {'user': user, 'title': title}
    document = collection.find_one(query)

    if not document:
        return jsonify({'message': 'Document not found'}), 404

    text = document.get('text')

    if not text:
        return jsonify({'message': 'Text field missing in document'}), 400

    return jsonify({'context': text, 'character': character, 'about_user': text})
    print(text)


@socketio.on('send_message')
def handle_send_message(json):
    user_msg = json['message']
    user = json['user']
    title = json['title']
    character = json['character']

    query = {'user': user, 'title': title}
    document = collection.find_one(query)

    if not document:
        emit('response_message', {'message': 'Document not found'})
        return

    context = document.get('text')
    if not context:
        emit('response_message', {'message': 'Context not found in document'})
        return

    character_reply = get_character_reply(character, user_msg, text)
    emit('response_message', {'message': character_reply})





# Route for health check (optional)
@app.route('/')
def health_check():
    return jsonify({'message': 'Server is healthy!'})

if __name__ == '__main__':
#    app.run(host='0.0.0.0', port=5000)
     socketio.run(app, host='0.0.0.0', port=5000)