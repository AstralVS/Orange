import os

import pandas as pd
import pymongo

# Configuration for MongoDB connection
MONGO_URL = 'mongodb+srv://astral:AST%40MongooseTest@cluster0.sezrl4o.mongodb.net/'
DB_NAME = 'Datas'

# Configuration for data preparation
DATA_DIR = 'data'
PRODUCTS_FILE = os.path.join(DATA_DIR, 'products_data.pkl')
USER_ACTIONS_FILE = os.path.join(DATA_DIR, 'user_actions_data.pkl')

def create_data_directory():
    # Create data directory if it doesn't exist
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f'Directory {DATA_DIR} created')
    else:
        pass

def connect_to_mongo():
    # Connect to MongoDB
    client = pymongo.MongoClient(MONGO_URL)
    db = client[DB_NAME]
    print('Connected to MongoDB')
    return db

def fetch_products_data(db):
    # Fetch products data
    products_cursor = db['products'].find({})
    categories_cursor = db['categories'].find({})

    categories_dict = { str(cat['_id']): cat['category_name'] for cat in categories_cursor }
    products_list = []

    for p in products_cursor:
        product = {
            'id': str(p['_id']),
            'name': p.get('name'),
            'category_name': categories_dict.get(str(p.get('category_id')), 'Unknown Category'),
            'description': p.get('description', ''),
            'price': p.get('price', 0),
        }
        products_list.append(product)
    products_df = pd.DataFrame(products_list)
    return products_df

def fetch_user_actions_data(db):
    user_actions_cursor = db['useractions'].find({})

    user_actions_list = []

    for u in user_actions_cursor:
        user_action = {
            'user_id': str(u.get('user_id')),
            'product_id': str(u.get('product_id')),
            'action_type': u.get('action_type'),
        }
        user_actions_list.append(user_action)
    user_actions_df = pd.DataFrame(user_actions_list)
    return user_actions_df


def run_data_preparation():
    database = connect_to_mongo()
    create_data_directory()

    products_df = fetch_products_data(database)
    user_actions_df = fetch_user_actions_data(database)

    # Save the dataframes to pickle files
    products_df.to_pickle(PRODUCTS_FILE)
    user_actions_df.to_pickle(USER_ACTIONS_FILE)
    print(f'Products data saved to {PRODUCTS_FILE}')
    print(f'User actions data saved to {USER_ACTIONS_FILE}')

    # Close the database connection
    database.client.close()

if __name__ == "__main__":
    run_data_preparation()