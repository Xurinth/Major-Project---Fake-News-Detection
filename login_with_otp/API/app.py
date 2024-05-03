from flask import Flask, request, jsonify
import torch
from transformers import BertTokenizer, BertConfig
from model import CustomBertModel
import requests
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
NEWS_API_KEY = "pub_366082c6c314ff65def084ba94646f7ced0ba"
NEWS_API_ENDPOINT = "https://newsdata.io/api/1/news"

# Load the BERT tokenizer and model
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
config = BertConfig.from_pretrained('bert-base-uncased')
config.num_labels = 2  # Set the number of labels for your classification task
config.vocab_size = 30000  # Set the vocab_size to match the one used during training
model = CustomBertModel(config)

# Load the pre-trained model weights
model.load_state_dict(torch.load("C:\\Users\\suraj\\OneDrive\\Desktop\\Models\\FND15.pth", map_location=torch.device('cpu')))
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def fetch_data_from_api():
    # Send a GET request to the API endpoint
    params = {
        "apiKey": NEWS_API_KEY,
        "language": "en"  # Add this parameter to fetch only English language data
        # Add any other required parameters
    }
    response = requests.get(NEWS_API_ENDPOINT, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        return data
    else:
        print(f"Error: {response.status_code}")
        return None

def fetch_and_preprocess_data():
    # Fetch data from the API
    fetched_data = fetch_data_from_api()

    # Check if the request was successful
    if fetched_data is not None:
        # Parse the JSON response
        fetched_data = fetched_data['results']

        # Convert fetched data to a pandas DataFrame
        news_df = pd.DataFrame(fetched_data)

        # Remove duplicate news titles
        news_df.drop_duplicates(subset='title', inplace=True)

        # Tokenize the data
        encoded_data = tokenizer.batch_encode_plus(
            news_df['title'].tolist(),
            max_length=512,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )

        # Add labels (assuming binary classification, 0 for true and 1 for fake)
        labels = [0] * len(news_df)  # Initialize all labels as 0 (true)
        labels = torch.tensor(labels)

        # You can add your labeling logic here
        # For example, you could check the 'source_priority' or other fields
        # to determine if a news article is fake or true
        # and update the labels accordingly

        # Example labeling logic based on 'source_priority'
        for i, row in news_df.iterrows():
            if row['source_priority'] < 100000:  # Assuming lower priority sources are more likely to be fake news
                labels[i] = 1  # Set the label as 1 (fake)

        return encoded_data, labels
    else:
        print("Error: Failed to fetch data from the API.")
        return None, None

def predict_news(input_text):
    # Tokenize the input text
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True, padding=True).to(device)

    # Make predictions
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs[0] if isinstance(outputs, tuple) else outputs
        probabilities = torch.softmax(logits, dim=-1)

    # Get the predicted class and probability
    predicted_class = torch.argmax(probabilities, dim=-1).item()
    predicted_probability = probabilities.max().item()

    return predicted_class, predicted_probability

@app.route('/fetch_and_preprocess', methods=['GET'])
def fetch_and_preprocess():
    encoded_data, labels = fetch_and_preprocess_data()
    if encoded_data is not None and labels is not None:
        # Prepare the response data
        response_data = []
        fetched_data = fetch_data_from_api()
        if fetched_data is not None:
            news_df = pd.DataFrame(fetched_data['results'])

            for i, row in news_df.iterrows():
                response_data.append({
                    'title': row['title'],
                    'predicted_class': labels[i].item()
                })

            return jsonify(response_data), 200
        else:
            return jsonify({"error": "Failed to fetch data from the API."}), 500
    else:
        return jsonify({"error": "Failed to fetch and preprocess data."}), 500

@app.route('/predict', methods=['POST'])
def predict():
    # Get the input text from the request
    input_text = request.json['text']

    # Make predictions
    predicted_class, predicted_probability = predict_news(input_text)

    # Prepare the response data
    response_data = {
        'text': input_text,
        'predicted_class': predicted_class,
        'predicted_probability': predicted_probability
    }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True) # Add debug=True for development