# model_preparation.py
import os

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Paths
DATA_DIR = 'data'
TRAINED_MODELS_DIR = "trained_models"
PRODUCTS_FILE = os.path.join(DATA_DIR, 'products_data.pkl')

VECTORIZER_FILE = os.path.join(TRAINED_MODELS_DIR, "tfidf_vectorizer.joblib")
SIMILARITY_MATRIX_FILE = os.path.join(TRAINED_MODELS_DIR, "similarity_matrix.joblib")
PRODUCT_IDS_MAP_FILE = os.path.join(TRAINED_MODELS_DIR, "product_ids_map.joblib") # map of product_id to index

def load_product_data():
    if not os.path.exists(PRODUCTS_FILE):
        print(f"Products data file not found: {PRODUCTS_FILE}")
        print("Please run data_preparation.py first.")
        return None
    try:
        products_df = pd.read_pickle(PRODUCTS_FILE)
        if products_df.empty:
            print("Products data is empty. Cannot train models.")
            return None
        print(f"Loaded {len(products_df)} products from {PRODUCTS_FILE}")
        return products_df
    except Exception as e:
        print(f"Error loading products data: {e}")
        return None

def train_and_save_models(products_df):
    if products_df is None:
        return False

    print("Processing TF-IDF Vectorizer and Similarity Matrix...")

    # Vectorize the product descriptions
    products_df['description'] = products_df['description'].fillna('')
    descriptions_list = products_df["description"].tolist()

    # Create TF-IDF Vectorizer
    current_vectorizer = TfidfVectorizer(stop_words='english')
    X = current_vectorizer.fit_transform(descriptions_list)

    # Compute the cosine similarity matrix
    current_similarity_matrix = cosine_similarity(X)

    # Create a mapping of product_id to index in the similarity matrix
    product_ids_ordered = products_df['id'].tolist()

    # Ensure the product_ids are in the same order as the similarity matrix
    current_product_id_to_idx = {pid: i for i, pid in enumerate(product_ids_ordered)}
    current_idx_to_product_id = {i: pid for i, pid in enumerate(product_ids_ordered)}

    # Create trained models directory if it doesn't exist
    if not os.path.exists(TRAINED_MODELS_DIR):
        os.makedirs(TRAINED_MODELS_DIR)
        print(f"Created directory: {TRAINED_MODELS_DIR}")

    # Save the vectorizer, similarity matrix, and product IDs mapping
    try:
        joblib.dump(current_vectorizer, VECTORIZER_FILE)
        joblib.dump(current_similarity_matrix, SIMILARITY_MATRIX_FILE)
        joblib.dump((current_product_id_to_idx, current_idx_to_product_id), PRODUCT_IDS_MAP_FILE)
        print("TF-IDF Vectorizer, Similarity Matrix, and Product ID Maps saved successfully.")
        return True
    except Exception as e:
        print(f"Error saving models: {e}")
        return False

def run_model_preparation():
    products_df = load_product_data()

    if products_df is not None:
        if train_and_save_models(products_df):
            print("Model preparation completed successfully.")
        else:
            print("Model preparation failed.")
    else:
        print("Model preparation could not start due to missing product data.")


if __name__ == "__main__":
    run_model_preparation()