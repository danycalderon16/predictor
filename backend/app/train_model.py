import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import sqlite3

import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "../data/database.sqlite")
conn = sqlite3.connect(db_path)


tablas = pd.read_sql_query("SELECT name from sqlite_master WHERE type='table';", conn)

print(tablas)