import os
import sqlite3
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "../data/database.sqlite")

conn = sqlite3.connect(db_path)

query = """
SELECT 
    home_team_api_id,
    away_team_api_id,
    home_team_goal,
    away_team_goal
FROM Match
WHERE home_team_goal IS NOT NULL AND away_team_goal IS NOT NULL;
"""

df = pd.read_sql_query(query, conn)
conn.close()


# Etiqueta: 1 = gana local, 0 = empate, -1 = gana visitante
def get_result(row):
    if row['home_team_goal'] > row['away_team_goal']:
        return 1  # Home win
    elif row['home_team_goal'] < row['away_team_goal']:
        return -1  # Away win
    else:
        return 0  # Draw

df['result'] = df.apply(get_result, axis=1)

X = df[['home_team_api_id','away_team_api_id']]
y = df['result']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluation
preds = model.predict(X_test)
accuracy = accuracy_score(y_test, preds)
print(f"Model accuracy: {accuracy:.2f}")

# Save model
model_path = os.path.join(BASE_DIR, "../models/trainig.pkl")
joblib.dump(model, model_path)
print(f"Model saved to {model_path}")