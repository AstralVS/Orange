import os

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request

app = Flask(__name__)

# Paths
DATA_DIR = 'data'
TRAINED_MODELS_DIR = "trained_models"
USER_ACTIONS_FILE = os.path.join(DATA_DIR, 'user_actions_data.pkl')

VECTORIZER_FILE = os.path.join(TRAINED_MODELS_DIR, "tfidf_vectorizer.joblib")
SIMILARITY_MATRIX_FILE = os.path.join(TRAINED_MODELS_DIR, "similarity_matrix.joblib")
PRODUCT_IDS_MAP_FILE = os.path.join(TRAINED_MODELS_DIR, "product_ids_map.joblib") # map of product_id to index in the similarity matrix

# Global containers
user_actions_df = None
user_behaviors_processed = {}

similarity_matrix_model = None
product_id_to_idx = None
idx_to_product_id = None

def check_data_and_model_files():
    # Check if the data files exist
    if not os.path.exists(USER_ACTIONS_FILE): # PRODUCTS_FILE is optional for basic recommendation
        print(f"User actions data file not found: {USER_ACTIONS_FILE}")
        print("Please run data_preparation.py.")
        return False
    # Check if trained model files exist
    if not os.path.exists(VECTORIZER_FILE) or \
       not os.path.exists(SIMILARITY_MATRIX_FILE) or \
       not os.path.exists(PRODUCT_IDS_MAP_FILE):
        print("Trained model files not found in trained_models/ directory.")
        print(f"Checked for: {VECTORIZER_FILE}, {SIMILARITY_MATRIX_FILE}, {PRODUCT_IDS_MAP_FILE}")
        print("Please run model_preparation.py first.")
        return False
    return True

def process_user_actions_to_behaviors():
    global user_actions_df, user_behaviors_processed
    if user_actions_df is None or user_actions_df.empty:
        print("No user actions data to process.")
        return

    for index, row in user_actions_df.iterrows():
        user_id = row['user_id']
        product_id = row['product_id']
        if user_id not in user_behaviors_processed:
            user_behaviors_processed[user_id] = {"interacted_products": set()}
        user_behaviors_processed[user_id]["interacted_products"].add(product_id)

def load_app_dependencies():
    global products_df, user_actions_df, user_behaviors_processed
    global vectorizer_model, similarity_matrix_model
    global product_id_to_idx, idx_to_product_id

    if not check_data_and_model_files():
        return False

    try:
        # Load user actions
        user_actions_df = pd.read_pickle(USER_ACTIONS_FILE)
        if user_actions_df.empty:
            print("User actions data is empty.")
        else:
            process_user_actions_to_behaviors()
            print(f"Loaded {len(user_actions_df)} user actions and processed behaviors for {len(user_behaviors_processed)} users.")

        # Load trained models
        print("Loading pre-trained models...")
        similarity_matrix_model = joblib.load(SIMILARITY_MATRIX_FILE)
        product_id_to_idx, idx_to_product_id = joblib.load(PRODUCT_IDS_MAP_FILE)
        print("Models loaded successfully.")

        if similarity_matrix_model is None or product_id_to_idx is None or idx_to_product_id is None:
            print("One or more critical model components failed to load.")
            return False
        return True

    except FileNotFoundError as e:
        print(f"Error: A required file was not found: {e}")
        print("Please ensure data_preparation.py and model_preparation.py have been run successfully.")
        return False
    except Exception as e:
        print(f"Error loading application dependencies: {e}")
        return False

if not load_app_dependencies():
    print("Critical error: Failed to load application dependencies. Exiting.")

@app.route('/recommend/<user_id_str>', methods=['GET'])
def get_recommendations_for_user(user_id_str):
    if similarity_matrix_model is None or product_id_to_idx is None or idx_to_product_id is None:
        return jsonify({"error": "Recommendation system is not ready or models not loaded"}), 503

    if user_id_str not in user_behaviors_processed:
        return jsonify({"error": f"No behavior data found for user {user_id_str}. Consider popular product suggestions."}), 404

    user_data = user_behaviors_processed[user_id_str]
    interacted_product_ids = user_data["interacted_products"]

    top_n = 10
    candidate_scores = {}

    # get candidate scores based on similarity matrix
    for interacted_pid_str in interacted_product_ids:
        # Check new product as the model isn't retrained
        if interacted_pid_str not in product_id_to_idx:
            continue

        interacted_product_idx = product_id_to_idx[interacted_pid_str]
        similarity_scores_for_interacted_item = similarity_matrix_model[interacted_product_idx]

        for other_product_idx, similarity_score in enumerate(similarity_scores_for_interacted_item):
            if similarity_score > 0: # Only consider items with some similarity
                other_product_id_str = idx_to_product_id.get(other_product_idx)
                if other_product_id_str and (other_product_id_str not in interacted_product_ids):
                    candidate_scores[other_product_id_str] = candidate_scores.get(other_product_id_str, 0) + similarity_score

    sorted_candidates = sorted(candidate_scores.items(), key=lambda item: item[1], reverse=True)

    suggested_product_ids_with_scores = []
    for product_id, score in sorted_candidates:
        if len(suggested_product_ids_with_scores) < top_n:
            suggested_product_ids_with_scores.append({
                "product_id": product_id,
                "score": round(score, 4)
            })
        else:
            break

    if not suggested_product_ids_with_scores:
        return jsonify({
            "user_id": user_id_str,
            "message": "No new recommendations found based on similarity. Consider popular items.",
            "recommendations": []
        }), 200

    return jsonify({
        "user_id": user_id_str,
        "recommendations": suggested_product_ids_with_scores
    })

@app.route('/health', methods=['GET'])
def health_check():
    # Endpoint to check if the recommendation service is running
    return "Recommendation service is running!", 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)